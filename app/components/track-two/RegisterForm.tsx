import React, { useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "~/store/authStore";

const RegisterForm = () => {
	const { login } = useAuthStore();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [secretPhrase, setSecretPhrase] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Establish a Socket.io connection to the '/auth' namespace
		const authSocket: Socket = io(`${import.meta.env.VITE_API_URL}/auth`, {
			transports: ["websocket"],
		});

		// Listen for connection
		authSocket.on("connect", () => {
			console.log("Connected to /auth namespace for registration.");
			authSocket.emit("register", {
				username,
				password,
				secret_phrase: secretPhrase,
				roles: "user",
			});
		});

		// Listen for successful registration
		authSocket.on("registration-success", ({ token }) => {
			console.log("Registration successful. Received token:", token);
			// Automatically log in the user by storing the token
			login(token);
			// Disconnect the auth socket
			authSocket.disconnect();
		});

		// Listen for registration errors
		authSocket.on("error", (err: any) => {
			console.error("Registration error via socket:", err);
			setError(err.error || "Registration failed.");
			setLoading(false);
			// Disconnect the auth socket
			authSocket.disconnect();
		});

		// Cleanup on disconnect
		authSocket.on("disconnect", (reason) => {
			console.log("Auth socket disconnected:", reason);
		});
	};

	return (
		<form
			onSubmit={handleRegister}
			className="space-y-4">
			<h2 className="text-xl font-semibold">Register</h2>
			{error && <p className="text-red-500">{error}</p>}
			<div>
				<label className="block mb-1">Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="w-full px-4 py-2 border rounded bg-white"
				/>
			</div>
			<div>
				<label className="block mb-1">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full px-4 py-2 border rounded bg-white"
				/>
			</div>
			<div>
				<label className="block mb-1">Secret Phrase</label>
				<input
					type="text"
					value={secretPhrase}
					onChange={(e) => setSecretPhrase(e.target.value)}
					required
					className="w-full px-4 py-2 border rounded bg-white"
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
				{loading ? "Registering..." : "Register"}
			</button>
		</form>
	);
};

export default RegisterForm;
