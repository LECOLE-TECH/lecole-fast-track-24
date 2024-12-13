import express from "express";
import {
	handleGetAllTodos,
	handleCreateTodo,
	handleUpdateTodoStatus,
	handleDeleteTodo,
	handleSyncTodos,
} from "../controllers/todoController.js";

const router = express.Router();

// GET All Todos
router.get("/", handleGetAllTodos);

// POST Create a New Todo
router.post("/", handleCreateTodo);

// PUT Update Todo Status
router.put("/:id", handleUpdateTodoStatus);

// DELETE a Todo
router.delete("/:id", handleDeleteTodo);

// POST Sync Todos
router.post("/sync", handleSyncTodos);

export default router;
