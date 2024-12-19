import express from "express"
import { catchErrorHandler } from "../middlewares/catch-error.js"
import { deleteTodo, SyncDataTodos } from "../controllers/todos.controller.js"

const todoRoute = express.Router()

todoRoute.post("/sync", catchErrorHandler(SyncDataTodos))

todoRoute.delete("/:id", catchErrorHandler(deleteTodo))

export default todoRoute
