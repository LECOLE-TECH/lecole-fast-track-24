import { getPagination, getById } from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.get("/api/product", getPagination);
router.get("/api/product/:id", getById);

export default (app) => {
  app.use(router);
};
