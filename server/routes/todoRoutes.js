import express from 'express';

export function setupTodoRoutes(todoController) {
  const router = express.Router();

  router.get('/todos', todoController.getAllTodos.bind(todoController));
  router.post('/todos', todoController.createTodo.bind(todoController));
  router.put('/todos/:id', todoController.updateTodoStatus.bind(todoController));
  router.post('/todos/sync', todoController.syncTodos.bind(todoController));
  router.delete('/todos/:id', todoController.deleteTodo.bind(todoController));

  return router;
}
