import express from "express";
import sqlite3 from "sqlite3";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

// Enable CORS and WASM support
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const db = new sqlite3.Database("./database/todos.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create todos table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Seed some initial todos if the table is empty
const seedTodos = [
  { title: "Learn React", status: "done" },
  { title: "Build a Todo App", status: "in_progress" },
  { title: "Master TypeScript", status: "backlog" },
];

db.get("SELECT COUNT(*) as count FROM todos", (err, row) => {
  if (row?.count === 0) {
    const stmt = db.prepare("INSERT INTO todos (title, status) VALUES (?, ?)");
    seedTodos.forEach(todo => {
      stmt.run(todo.title, todo.status);
    });
    stmt.finalize();
    console.log("Database seeded with initial todos");
  }
});

app.use(express.json());

// Get all todos
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new todo
app.post("/api/todos", (req, res) => {
  const { title, status = 'backlog' } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  db.run(
    "INSERT INTO todos (title, status) VALUES (?, ?)",
    [title, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get(
        "SELECT * FROM todos WHERE id = ?",
        [this.lastID],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

// Update todo status
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['backlog', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: "Valid status is required" });
  }

  db.run(
    "UPDATE todos SET status = ? WHERE id = ?",
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ id, status });
    }
  );
});

app.post("/api/todos/sync", (req, res) => {
  const { todos } = req.body;
  
  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: "Invalid sync data format" });
  }

  db.serialize(() => {
    try {
      db.run("BEGIN TRANSACTION");
      // Process each todo from the client
      todos.forEach(todo => {
        // For new todos, the server should check if this todo exists
        db.get("SELECT id FROM todos WHERE id = ?", [todo.id], (err, row) => {
          if (!row) {
            // This is a new todo, insert it
            db.run(
              "INSERT INTO todos (title, status) VALUES (?, ?)",
              [todo.title, todo.status]
            );
          } else {
            // Update existing todo
            db.run(
              "UPDATE todos SET status = ? WHERE id = ?",
              [todo.status, todo.id]
            );
          }
        });
      });

      db.run("COMMIT", [], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        // Return all todos after sync
        db.all("SELECT * FROM todos ORDER BY created_at DESC", [], (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json(rows);
        });
      });

    } catch (err) {
      db.run("ROLLBACK");
      res.status(500).json({ error: err.message });
    }
  });
});


// Delete todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
