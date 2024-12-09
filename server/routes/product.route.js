import { getAll } from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.get("/api/product", getAll);

export default (app) => {
  app.use(router);
};
