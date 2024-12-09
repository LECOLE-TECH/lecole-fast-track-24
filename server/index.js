import express from "express";
import sqlite3 from "sqlite3";
import fs from "fs";
import { body, validationResult } from "express-validator";

const app = express();
const port = 3000;

const productFormValidation = [
  body("name").isString().withMessage("Name must be a string."),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer."),
  body("description").isString().withMessage("Description must be a string.")
]

if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database", { recursive: true });
}

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

app.use(express.json());

// Read All Products
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Read Single Product by ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(row);
  });
});

//  Create a New Product
app.post("/api/products",productFormValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, stock } = req.body;

  db.run(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [name, description, price, stock],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update an Existing Product by ID
app.put("/api/products/:id",productFormValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  db.run(
    "UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ?",
    [name, description, price, stock, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

// Delete a Product by ID
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
