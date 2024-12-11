import db from "../database/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "./server/.env" });

const socketHandler = (io) => {
	// Authenticated namespace
	const authNamespace = io.of("/");

	// Authentication middleware for authenticated namespace
	authNamespace.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			console.log("Authentication error: No token provided");
			return next(new Error("Authentication error"));
		}
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				console.log("Authentication error: Invalid token");
				return next(new Error("Authentication error"));
			}
			socket.user = user;
			next();
		});
	});

	authNamespace.on("connection", (socket) => {
		try {
			console.log(`User connected: ${socket.user.username}`);

			// Handle update-secret-phrase event
			socket.on("update-secret-phrase", (data) => {
				const { userId, newSecretPhrase, actorId } = data;
				console.log(`Received update-secret-phrase from ${actorId}:`, data);

				// Ensure actorId matches the authenticated user's username
				if (actorId !== socket.user.username) {
					socket.emit("error", { error: "Invalid actor ID." });
					console.log(`Invalid actor ID: ${actorId}`);
					return;
				}

				// Retrieve actor's details from the database
				db.get(
					"SELECT * FROM users WHERE username = ?",
					[actorId],
					(err, actor) => {
						if (err) {
							socket.emit("error", { error: "Database error" });
							console.error("Database error:", err);
							return;
						}

						if (!actor) {
							socket.emit("error", { error: `Actor not found: ${actorId}` });
							console.log(`Actor not found: ${actorId}`);
							return;
						}

						// Permission check: admin or self
						if (actor.roles === "admin" || actor.id === userId) {
							db.run(
								"UPDATE users SET secret_phrase = ? WHERE id = ?",
								[newSecretPhrase, userId],
								(err) => {
									if (err) {
										socket.emit("error", {
											error: "Failed to update secret phrase",
										});
										console.error("Failed to update secret phrase:", err);
										return;
									}

									// Emit secret-phrase-updated to all authenticated clients
									authNamespace.emit("secret-phrase-updated", {
										userId,
										newSecretPhrase,
									});
									socket.emit("success", {
										message: "Secret phrase updated successfully",
									});
									console.log(
										`Secret phrase updated successfully for user ID: ${userId}`,
									);
								},
							);
						} else {
							socket.emit("error", {
								error:
									"You do not have permission to update this user's secret phrase",
							});
							console.log(
								`No permission to update secret phrase: ${actorId}, Roles: ${actor.roles}`,
							);
						}
					},
				);
			});

			socket.on("disconnect", (reason) => {
				console.log(
					`User disconnected: ${socket.user.username} | Reason: ${reason}`,
				);
			});
		} catch (error) {
			console.error("Socket connection error:", error);
			socket.emit("error", { error: "Internal server error." });
		}
	});

	// Unauthenticated namespace for registration and login
	const authNamespaceUnauthenticated = io.of("/auth");

	authNamespaceUnauthenticated.on("connection", (socket) => {
		console.log("Unauthenticated socket connected for auth operations.");

		// Handle user registration
		socket.on("register", async (data) => {
			const { username, password, secret_phrase, roles } = data;
			console.log(`Received registration request for username: ${username}`);

			if (!username || !password || !secret_phrase || !roles) {
				socket.emit("error", { error: "All fields are required." });
				return;
			}

			try {
				// Check if user already exists
				const existingUser = await new Promise((resolve, reject) => {
					db.get(
						"SELECT * FROM users WHERE username = ?",
						[username],
						(err, row) => {
							if (err) reject(err);
							else resolve(row);
						},
					);
				});

				if (existingUser) {
					socket.emit("error", { error: "Username already exists." });
					return;
				}

				// Hash password
				const hashedPassword = await bcrypt.hash(password, 10);

				// Insert new user into the database
				const newUser = await new Promise((resolve, reject) => {
					db.run(
						"INSERT INTO users (username, password, roles, secret_phrase) VALUES (?, ?, ?, ?)",
						[username, hashedPassword, roles, secret_phrase],
						function (err) {
							if (err) reject(err);
							else
								resolve({
									id: this.lastID,
									username,
									roles,
									secret_phrase,
								});
						},
					);
				});

				// Emit 'new-user' event to all authenticated clients
				authNamespace.emit("new-user", newUser);
				authNamespaceUnauthenticated.emit("new-user", newUser);

				// Generate JWT token for the new user
				const token = jwt.sign(
					{
						id: newUser.id,
						username: newUser.username,
						roles: newUser.roles,
					},
					process.env.JWT_SECRET,
					{ expiresIn: "1h" },
				);

				socket.emit("registration-success", { token });

				console.log(`User registered successfully: ${username}`);
			} catch (err) {
				console.error("Registration error:", err);
				socket.emit("error", {
					error: "Registration failed due to server error.",
				});
			}
		});

		// Handle user login
		socket.on("login", async (data) => {
			const { username, password } = data;
			console.log(`Received login request for username: ${username}`);

			if (!username || !password) {
				socket.emit("error", { error: "Username and password are required." });
				return;
			}

			try {
				// Retrieve user from the database
				const user = await new Promise((resolve, reject) => {
					db.get(
						"SELECT * FROM users WHERE username = ?",
						[username],
						(err, row) => {
							if (err) reject(err);
							else resolve(row);
						},
					);
				});

				if (!user) {
					socket.emit("error", { error: "Invalid username or password." });
					return;
				}

				// Compare passwords
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					socket.emit("error", { error: "Invalid username or password." });
					return;
				}

				// Generate JWT token
				const token = jwt.sign(
					{
						id: user.id,
						username: user.username,
						roles: user.roles,
					},
					process.env.JWT_SECRET,
					{ expiresIn: "1h" },
				);

				// Emit 'login-success' event with the token
				socket.emit("login-success", { token });

				console.log(`User logged in successfully: ${username}`);
			} catch (err) {
				console.error("Login error:", err);
				socket.emit("error", { error: "Login failed due to server error." });
			}
		});

		socket.on("disconnect", (reason) => {
			console.log(`Unauthenticated socket disconnected: ${reason}`);
		});
	});
};

export default socketHandler;
