import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../models/productModel.js";

// Get All Products
export const handleGetAllProducts = async (req, res, next) => {
	try {
		const products = await getAllProducts();
		res.json(products);
	} catch (err) {
		next(err);
	}
};

// Get Product by ID
export const handleGetProductById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const product = await getProductById(id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ error: "Product not found." });
		}
	} catch (err) {
		next(err);
	}
};

// Create a New Product
export const handleCreateProduct = async (req, res, next) => {
	const { name, description, price, stock } = req.body;
	if (!name || price === undefined || stock === undefined) {
		return res
			.status(400)
			.json({ error: "Name, price, and stock are required." });
	}
	try {
		const newProduct = await createProduct({ name, description, price, stock });
		res.status(201).json(newProduct);
	} catch (err) {
		next(err);
	}
};

// Update an Existing Product
export const handleUpdateProduct = async (req, res, next) => {
	const { id } = req.params;
	const { name, description, price, stock } = req.body;
	if (!name || price === undefined || stock === undefined) {
		return res
			.status(400)
			.json({ error: "Name, price, and stock are required." });
	}
	try {
		const updatedProduct = await updateProduct(id, {
			name,
			description,
			price,
			stock,
		});
		if (updatedProduct.changes === 0) {
			res.status(404).json({ error: "Product not found." });
		} else {
			res.json(updatedProduct);
		}
	} catch (err) {
		next(err);
	}
};

// Delete a Product
export const handleDeleteProduct = async (req, res, next) => {
	const { id } = req.params;
	try {
		const result = await deleteProduct(id);
		if (result.changes === 0) {
			res.status(404).json({ error: "Product not found." });
		} else {
			res.status(204).send();
		}
	} catch (err) {
		next(err);
	}
};
