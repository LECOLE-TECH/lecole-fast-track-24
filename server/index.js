import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import db from "./database/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);
app.use(logger);

// Routes
app.use("/api/product", productRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
