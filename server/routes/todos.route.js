import express from "express";
import todosController from "../controllers/todos.controller.js";

const router = express.Router();

router.get("/api/todos", todosController.getAll);
router.post("/api/todos", todosController.create);
router.patch("/api/todos/:id", todosController.update);
router.delete("/api/todos/:id", todosController.remove);

router.post("/api/todos/sync", todosController.syncMultiTodo);

export default (app) => {
  app.use(router);
};
