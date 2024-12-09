import {
  getPagination,
  getById,
  create,
  update,
  remove,
} from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.get("/api/product", getPagination);
router.get("/api/product/:id", getById);
router.post("/api/product", create);
router.patch("/api/product/:id", update);
router.delete("/api/product/:id", remove);

export default (app) => {
  app.use(router);
};
