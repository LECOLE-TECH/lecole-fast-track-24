import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import socketHandler from "./sockets/socketHandler.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import { setIO } from "./sockets/instance.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	},
});

// Set the Socket.io instance for use in other modules
setIO(io);

// Apply Express middleware to the Express app, not the server
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
app.use("/api/user", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Initialize Socket.io handlers
socketHandler(io);

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
