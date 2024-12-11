import {
	registerUser,
	getUserByUsername,
	getAllUsersFromDB,
	getUserByIdFromDB,
	updateUserSecretPhrase,
	getAllUsernamesFromDB,
} from "../models/userModel.js";
import { getIO } from "../sockets/instance.js";

export const handleRegisterUser = async (req, res, next) => {
	const { username, password, secret_phrase, roles } = req.body;
	if (!username || !password || !roles || !secret_phrase) {
		return res
			.status(400)
			.json({ error: "Username, roles, and secret phrase are required" });
	}
	try {
		const existingUser = await getUserByUsername(username);
		if (existingUser) {
			return res.status(409).json({ error: "Username already exists" });
		}
		const newUser = await registerUser({
			username,
			password,
			secret_phrase,
			roles,
		});
		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
};

// Get All Users (Admin Only)
export const handleGetAllUsers = async (req, res, next) => {
	try {
		const users = await getAllUsersFromDB();
		res.json(users);
	} catch (err) {
		next(err);
	}
};

// Get User by ID (Self or Admin)
export const handleGetUserById = async (req, res, next) => {
	const user = req.user;
	const { id } = req.params;

	if (user.id !== parseInt(id) && user.roles !== "admin") {
		return res.status(403).json({ error: "Forbidden" });
	}

	try {
		const userData = await getUserByIdFromDB(id);
		if (!userData) {
			return res.status(404).json({ error: "User not found." });
		}
		res.json(userData);
	} catch (err) {
		next(err);
	}
};

// Update Secret Phrase (Self or Admin)
export const handleUpdateSecretPhrase = async (req, res, next) => {
	const user = req.user;
	const { id } = req.params;
	const { newSecretPhrase } = req.body;

	if (!newSecretPhrase) {
		return res.status(400).json({ error: "New secret phrase is required." });
	}

	if (user.id !== parseInt(id) && user.roles !== "admin") {
		return res.status(403).json({ error: "Forbidden" });
	}

	try {
		const result = await updateUserSecretPhrase(id, newSecretPhrase);
		if (result.changes === 0) {
			return res.status(404).json({ error: "User not found." });
		}
		res.json({ message: "Secret phrase updated successfully." });
	} catch (err) {
		next(err);
	}
};

export const handleGetAllUsernames = async (req, res, next) => {
	try {
		const usernames = await getAllUsernamesFromDB();
		res.json(usernames);
	} catch (err) {
		next(err);
	}
};
