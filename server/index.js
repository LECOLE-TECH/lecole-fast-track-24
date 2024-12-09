import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.get("/api/product", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
