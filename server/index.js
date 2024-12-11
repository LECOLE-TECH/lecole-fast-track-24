import express from "express";
import sqlite3 from "sqlite3";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

const db = new sqlite3.Database("./database/products.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      roles TEXT NOT NULL,
      secret_phrase TEXT NOT NULL
    )
  `);
});

const seedProductData = [
  { name: "Product A", description: "Description of Product A", price: 19.99, stock: 100 },
  { name: "Product B", description: "Description of Product B", price: 29.99, stock: 150 },
  { name: "Product C", description: "Description of Product C", price: 9.99, stock: 200 },
  { name: "Product D", description: "Description of Product D", price: 49.99, stock: 80 },
  { name: "Product E", description: "Description of Product E", price: 24.99, stock: 50 }
];

const seedUserData = [
  { username: "user1", roles: "user", secret_phrase: "secret123" },
  { username: "admin1", roles: "admin", secret_phrase: "admin123" },
  { username: "user2", roles: "user", secret_phrase: "secret456" },
  { username: "admin2", roles: "admin", secret_phrase: "admin456" }
];

db.serialize(() => {
  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (row?.count === 0) {
      const stmt = db.prepare("INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)");
      for (const product of seedProductData) {
        stmt.run(product.name, product.description, product.price, product.stock);
      }
      stmt.finalize();
      console.log("Database seeded with products data");
    }
  });

  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (row?.count === 0) {
      const stmt = db.prepare("INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)");
      for (const user of seedUserData) {
        stmt.run(user.username, user.roles, user.secret_phrase);
      }
      stmt.finalize();
      console.log("Database seeded with users data");
    }
  });
});

app.use(express.json());

app.get("/api/product", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/register", (req, res) => {
  const { username, roles, secret_phrase } = req.body;

  if (!username || !roles || !secret_phrase) {
    return res.status(400).json({ error: "Username, roles, and secret phrase are required" });
  }

  db.run(
    "INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)",
    [username, roles, secret_phrase],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("update-secret-phrase", (data) => {
    const { userId, newSecretPhrase, actorId } = data;
    console.log(data);

    db.get("SELECT * FROM users WHERE username = ?", [actorId], (err, actor) => {
      if (err) {
        socket.emit("error", { error: "Database error" });
        console.log(err);
        return;
      }

      if (!actor) {
        socket.emit("error", { error: `Actor not found: ${actorId}` });
        console.log(`Actor not found: ${actorId}`);
        return;
      }

      if (actor.roles === "admin" || actorId === userId) {
        db.run("UPDATE users SET secret_phrase = ? WHERE username = ?", [newSecretPhrase, userId], (err) => {
          if (err) {
            socket.emit("error", { error: "Failed to update secret phrase" });
            console.log(err);
            return;
          }

          io.emit("secret-phrase-updated", {
            userId,
            newSecretPhrase
          });
          socket.emit("success", { message: "Secret phrase updated successfully" });
          console.log("Secret phrase updated successfully");
        });
      } else {
        socket.emit("error", { error: "You do not have permission to update this user's secret phrase" });
        console.log(`You do not have permission to update this user's secret phrase: ${actorId}, ${actor.roles}`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
