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
}

export default new TodosController();
