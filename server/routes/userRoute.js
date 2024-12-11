import express from "express";
import {
	handleRegisterUser,
	handleGetAllUsers,
	handleGetUserById,
	handleUpdateSecretPhrase,
	handleGetAllUsernames,
} from "../controllers/userController.js";
import { handleLogin } from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
const router = express.Router();

// Register a new user
router.post("/register", handleRegisterUser);

// Login user
router.post("/login", handleLogin);

// Get all usernames
router.get("/usernames", handleGetAllUsernames);

// Get all users (Admin only)
router.get("/", authenticateJWT, handleGetAllUsers);

// Get user by ID (Authenticated or Admin)
router.get("/:id", authenticateJWT, handleGetUserById);

// Update secret phrase (Self or Admin)
router.put("/:id/secret-phrase", authenticateJWT, handleUpdateSecretPhrase);

export default router;
