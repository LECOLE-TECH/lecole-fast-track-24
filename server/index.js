// server/index.js
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from this origin
}));

app.use(express.json()); // Middleware to parse JSON request bodies

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
});

const seedData = [
  { name: "Product A", description: "Description of Product A", price: 19.99, stock: 100 },
  { name: "Product B", description: "Description of Product B", price: 29.99, stock: 150 },
  { name: "Product C", description: "Description of Product C", price: 9.99, stock: 200 },
  { name: "Product D", description: "Description of Product D", price: 49.99, stock: 80 },
  { name: "Product E", description: "Description of Product E", price: 24.99, stock: 50 }
];

db.serialize(() => {
  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (row?.count === 0) {
      const stmt = db.prepare("INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)");
      for (const product of seedData) {
        stmt.run(product.name, product.description, product.price, product.stock);
      }
      stmt.finalize();
      console.log("Database seeded with dummy data");
    }
  });
});

app.get("/api/product", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// CREATE
app.post("/api/product", (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !price || !stock) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  db.run("INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)", [name, description, price, stock], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
      console.log("Product added with ID:", this.lastID);
  });
});
// Delete
app.delete("/api/product/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
      console.log("Product deleted with ID:", req.params.id);
  });
});
// Read
app.get("/api/product/:id", (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", req.params.id, (err, row) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        if (!row) {
        res.status(404).json({ error: "Product not found" });
        return;
        }
        res.json(row);
        console.log("Product found with ID:", req.params.id);
    });
});
// Update
app.put("/api/product/:id", (req, res) => {
    const { name, description, price, stock } = req.body;
    if (!name || !price || !stock) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    db.run("UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?", [name, description, price, stock, req.params.id], function(err) {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        console.log("Product updated with ID:", req.params.id);
        res.json({ changes: this.changes });
    });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
