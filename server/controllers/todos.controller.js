import { standardResponse } from "../config/response.config.js";
import todosService from "../services/todos.service.js";

class TodosController {
  async getAll(req, res) {
    try {
      const todos = await todosService.getAllTodos();
      standardResponse(res, 200, todos, "Fetch success");
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to fetch todos api");
    }
  }

  async create(req, res) {
    try {
      const { title, status } = req.body;
      const todo = await todosService.createTodo(title, status);
      standardResponse(res, 201, todo, "Create success");
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to create todo api");
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedTodo = await todosService.updateTodo(Number(id), status);
      if (updatedTodo === "Todo not found") {
        return standardResponse(res, 404, null, updatedTodo);
      }
      return standardResponse(res, 201, updatedTodo, "Update success");
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to udpate todo api");
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deletedTodo = await todosService.deleteTodo(Number(id));
      if (deletedTodo === "Todo not found") {
        return standardResponse(res, 404, null, deletedTodo);
      }
      return standardResponse(res, 200, null, deletedTodo);
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to udpate todo api");
    }
  }

  async syncMultiTodo(req, res) {
    try {
      const { todos } = req.body;
      if (!Array.isArray(todos)) {
        return standardResponse(res, 400, null, "Invalid sync data");
      }
      const syncedTodos = await todosService.syncMultiTodo(todos);
      standardResponse(res, 201, syncedTodos, "Sync success");
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to sync todos api");
    }
  }
}

export default new TodosController();
