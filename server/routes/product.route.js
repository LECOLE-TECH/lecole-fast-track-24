import {
  getPagination,
  getById,
  create,
} from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.get("/api/product", getPagination);
router.get("/api/product/:id", getById);
router.post("/api/product", create);

export default (app) => {
  app.use(router);
};
