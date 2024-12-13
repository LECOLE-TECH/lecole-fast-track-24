import {
	getAllTodos,
	createTodo,
	updateTodoStatus,
	deleteTodo,
	syncTodos,
} from "../models/todoModel.js";

// Get All Todos
export const handleGetAllTodos = async (req, res, next) => {
	try {
		const todos = await getAllTodos();
		res.json(todos);
	} catch (err) {
		next(err);
	}
};

// Create New Todo
export const handleCreateTodo = async (req, res, next) => {
	const { title, status } = req.body;

	try {
		const newTodo = await createTodo({ title, status });
		res.status(201).json(newTodo);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Update Todo Status
export const handleUpdateTodoStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;

	try {
		const updatedTodo = await updateTodoStatus(id, status);
		res.json(updatedTodo);
	} catch (err) {
		if (err.message === "Todo not found") {
			res.status(404).json({ error: err.message });
		} else {
			res.status(400).json({ error: err.message });
		}
	}
};

// Delete Todo
export const handleDeleteTodo = async (req, res, next) => {
	const { id } = req.params;

	try {
		const result = await deleteTodo(id);
		res.json(result);
	} catch (err) {
		if (err.message === "Todo not found") {
			res.status(404).json({ error: err.message });
		} else {
			res.status(500).json({ error: err.message });
		}
	}
};

// Sync Todos
export const handleSyncTodos = async (req, res, next) => {
	const { todos } = req.body;

	try {
		const syncedTodos = await syncTodos(todos);
		res.json(syncedTodos);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};
