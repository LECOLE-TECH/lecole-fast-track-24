import express from "express";
import {
	handleGetAllProducts,
	handleGetProductById,
	handleCreateProduct,
	handleUpdateProduct,
	handleDeleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET All Products
router.get("/", handleGetAllProducts);

// GET Product by ID
router.get("/:id", handleGetProductById);

// POST Create a New Product
router.post("/", handleCreateProduct);

// PUT Update an Existing Product
router.put("/:id", handleUpdateProduct);

// DELETE a Product
router.delete("/:id", handleDeleteProduct);

export default router;
