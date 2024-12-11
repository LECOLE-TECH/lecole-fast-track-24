import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from 'cors';
import { sequelize, Product, User } from "../db/db.js"; // Import Sequelize và các models
import { where } from "sequelize";
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors())

app.get("/api/product", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/product", async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !description || !price || !stock) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
    });
    return res.status(201).json(newProduct); // Trả về sản phẩm mới
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
app.patch(`/api/product/:id`, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  try {
    const updatedRowsCount = await Product.update(
      { name, description, price, stock },
      { where: { id } } 
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete(`/api/product/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const delProduct = await Product.destroy({
      where: { id }
    });

    if (delProduct) {
      res.status(200).json({ message: "Product deleted successfully", delProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.post("/api/register", async (req, res) => {
  const { username, roles, secret_phrase } = req.body;

  if (!username || !roles || !secret_phrase) {
    return res.status(400).json({ error: "Username, roles, and secret phrase are required" });
  }

  try {
    await User.create({ username, roles, secret_phrase });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("update-secret-phrase", async (data) => {
    const { userId, newSecretPhrase, actorId } = data;
    console.log(data);

    try {
      const actor = await User.findOne({ where: { username: actorId } });

      if (!actor) {
        socket.emit("error", { error: `Actor not found: ${actorId}` });
        console.log(`Actor not found: ${actorId}`);
        return;
      }

      if (actor.roles === "admin" || actorId === userId) {
        await User.update({ secret_phrase: newSecretPhrase }, { where: { username: userId } });

        io.emit("secret-phrase-updated", {
          userId,
          newSecretPhrase,
        });
        socket.emit("success", { message: "Secret phrase updated successfully" });
        console.log("Secret phrase updated successfully");
      } else {
        socket.emit("error", { error: "You do not have permission to update this user's secret phrase" });
        console.log(`You do not have permission to update this user's secret phrase: ${actorId}, ${actor.roles}`);
      }
    } catch (err) {
      socket.emit("error", { error: "Database error" });
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
