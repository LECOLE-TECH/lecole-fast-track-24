import { getAll, getById } from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.get("/api/product", getAll);
router.get("/api/product/:id", getById);

export default (app) => {
  app.use(router);
};
