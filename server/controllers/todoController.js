export class TodoController {
  constructor(todoService) {
    this.todoService = todoService;
  }

  async getAllTodos(req, res) {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createTodo(req, res) {
    try {
      const { title, status = 'backlog' } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const todo = await this.todoService.createTodo(title, status);
      res.status(201).json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateTodoStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !['backlog', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({ error: "Valid status is required" });
      }
      const result = await this.todoService.updateTodoStatus(id, status);
      if (!result) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ id, status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async syncTodos(req, res) {
    try {
      const { todos } = req.body;
      if (!Array.isArray(todos)) {
        return res.status(400).json({ error: "Invalid sync data format" });
      }
      const syncedTodos = await this.todoService.syncTodos(todos);
      res.json(syncedTodos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const result = await this.todoService.deleteTodo(id);
      if (!result) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ message: "Todo deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
