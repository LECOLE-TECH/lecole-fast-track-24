import express from "express";
import db from "../db/database.js";

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new product
router.post("/", (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !price || !stock) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  db.run(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [name, description, price, stock],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update a product
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock } = req.body;
  const fields = [];
  const values = [];

  if (name) fields.push("name = ?"), values.push(name);
  if (description) fields.push("description = ?"), values.push(description);
  if (price) fields.push("price = ?"), values.push(price);
  if (stock) fields.push("stock = ?"), values.push(stock);

  if (fields.length === 0) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  values.push(id);

  db.run(
    `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
});

// Delete a product
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM products WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

export default router;
