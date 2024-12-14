import express from "express";
import http from "http";
import { Server } from "socket.io";
import { TodoService } from "./services/todoService.js";
import { TodoController } from "./controllers/todoController.js";
import { setupTodoRoutes } from "./routes/todoRoutes.js";
import { initializeDatabase } from "./config/init.js";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

// Middleware setup
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Initialize database
const db = initializeDatabase();

// Initialize services and controllers
const todoService = new TodoService(db);
const todoController = new TodoController(todoService);

// Setup routes
app.use('/api', setupTodoRoutes(todoController));

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});