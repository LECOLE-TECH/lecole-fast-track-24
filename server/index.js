import express from "express";
import http from "http";
import session from "express-session";
import { Server } from "socket.io";
import funcUserRouter from "./routes/user.router.js";
import funcAuthRouter from "./routes/auth.router.js";
import cors from "cors";
import handleSocket from "./utils/socket.js";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Use cors middleware with more specific options
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

funcUserRouter(app);
funcAuthRouter(app);
handleSocket(io);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
