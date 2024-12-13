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
}

export default new TodosController();
