import { PrismaClient } from "@prisma/client";
import express from "express";
import funcProductRoute from "./routes/product.route.js";

const app = express();
const port = 3000;

app.use(express.json());

funcProductRoute(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
