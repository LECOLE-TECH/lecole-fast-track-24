import express from "express";
import sqlite3 from "sqlite3";
import http from "http";
import { Server } from "socket.io";
import funcTodoRoute from "./routes/todos.route.js";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Enable CORS and WASM support
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
funcTodoRoute(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
