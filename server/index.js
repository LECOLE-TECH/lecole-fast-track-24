import express from "express";
import sqlite3 from "sqlite3";
import http from "http";
import { Server } from "socket.io";
import funcTodoRoute from "./routes/todos.route.js";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

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

// // Update todo status
// app.put("/api/todos/:id", (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!status || !['backlog', 'in_progress', 'done'].includes(status)) {
//     return res.status(400).json({ error: "Valid status is required" });
//   }

//   db.run(
//     "UPDATE todos SET status = ? WHERE id = ?",
//     [status, id],
//     function(err) {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       if (this.changes === 0) {
//         return res.status(404).json({ error: "Todo not found" });
//       }
//       res.json({ id, status });
//     }
//   );
// });

// // Sync endpoint to handle multiple todos
// app.post("/api/todos/sync", (req, res) => {
//   const { todos } = req.body;

//   if (!Array.isArray(todos)) {
//     return res.status(400).json({ error: "Invalid sync data format" });
//   }

//   db.serialize(() => {
//     try {
//       db.run("BEGIN TRANSACTION");

//       // Process each todo from the client
//       todos.forEach(todo => {
//         if (todo.id) {
//           // Update existing todo
//           db.run(
//             "UPDATE todos SET status = ? WHERE id = ?",
//             [todo.status, todo.id]
//           );
//         } else {
//           // Insert new todo
//           db.run(
//             "INSERT INTO todos (title, status) VALUES (?, ?)",
//             [todo.title, todo.status]
//           );
//         }
//       });

//       db.run("COMMIT", [], (err) => {
//         if (err) {
//           res.status(500).json({ error: err.message });
//           return;
//         }

//         // Return all todos after sync
//         db.all("SELECT * FROM todos ORDER BY created_at DESC", [], (err, rows) => {
//           if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//           }
//           res.json(rows);
//         });
//       });

//     } catch (err) {
//       db.run("ROLLBACK");
//       res.status(500).json({ error: err.message });
//     }
//   });
// });

// // Delete todo
// app.delete("/api/todos/:id", (req, res) => {
//   const { id } = req.params;

//   db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (this.changes === 0) {
//       return res.status(404).json({ error: "Todo not found" });
//     }
//     res.json({ message: "Todo deleted successfully" });
//   });
// });

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
