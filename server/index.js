// import express from "express";
// import sqlite3 from "sqlite3";
// import http from "http";
// import { Server } from "socket.io";
// import fs from "fs";


// const app = express();
// const port = 3000;

// const server = http.createServer(app);
// const io = new Server(server);

// if (!fs.existsSync("./database")) {
//   fs.mkdirSync("./database", { recursive: true });
// }


// const db = new sqlite3.Database("./database/products.db", (err) => {
//   if (err) {
//     console.error("Error opening database:", err);
//   } else {
//     console.log("Connected to the SQLite database.");
//   }
// });

// db.serialize(() => {

//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT NOT NULL UNIQUE,
//       roles TEXT NOT NULL,
//       secret_phrase TEXT NOT NULL
//     )
//   `);
// });

// const seedUserData = [
//   { username: "user1", roles: "user", secret_phrase: "secret123" },
//   { username: "admin1", roles: "admin", secret_phrase: "admin123" },
//   { username: "user2", roles: "user", secret_phrase: "secret456" },
//   { username: "admin2", roles: "admin", secret_phrase: "admin456" }
// ];

// db.serialize(() => {
//   db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
//     if (row?.count === 0) {
//       const stmt = db.prepare("INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)");
//       for (const user of seedUserData) {
//         stmt.run(user.username, user.roles, user.secret_phrase);
//       }
//       stmt.finalize();
//       console.log("Database seeded with users data");
//     }
//   });
// });

// app.use(express.json());

// app.post("/api/register", (req, res) => {
//   const { username, roles, secret_phrase } = req.body;

//   if (!username || !roles || !secret_phrase) {
//     return res.status(400).json({ error: "Username, roles, and secret phrase are required" });
//   }

//   db.run(
//     "INSERT INTO users (username, roles, secret_phrase) VALUES (?, ?, ?)",
//     [username, roles, secret_phrase],
//     (err) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(201).json({ message: "User created successfully" });
//     }
//   );
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("update-secret-phrase", (data) => {
//     const { userId, newSecretPhrase, actorId } = data;
//     console.log(data);

//     db.get("SELECT * FROM users WHERE username = ?", [actorId], (err, actor) => {
//       if (err) {
//         socket.emit("error", { error: "Database error" });
//         console.log(err);
//         return;
//       }

//       if (!actor) {
//         socket.emit("error", { error: `Actor not found: ${actorId}` });
//         console.log(`Actor not found: ${actorId}`);
//         return;
//       }

//       if (actor.roles === "admin" || actorId === userId) {
//         db.run("UPDATE users SET secret_phrase = ? WHERE username = ?", [newSecretPhrase, userId], (err) => {
//           if (err) {
//             socket.emit("error", { error: "Failed to update secret phrase" });
//             console.log(err);
//             return;
//           }

//           io.emit("secret-phrase-updated", {
//             userId,
//             newSecretPhrase
//           });
//           socket.emit("success", { message: "Secret phrase updated successfully" });
//           console.log("Secret phrase updated successfully");
//         });
//       } else {
//         socket.emit("error", { error: "You do not have permission to update this user's secret phrase" });
//         console.log(`You do not have permission to update this user's secret phrase: ${actorId}, ${actor.roles}`);
//       }
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
import express from "express";
import appRouter from "./routes/index.js";
import http from "http";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { initializeSocketServer } from "./utils/socket/socketServer.js";
import { initializeSocket } from "./utils/socket/socket.js";
import cors from "cors"

dotenv.config()
const app = express()
const corsOptions = {
  origin: [process.env.FRONTEND_URL], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
const server = http.createServer(app);
const io = initializeSocketServer(server);//Set up socket server

initializeSocket(io) // Add event for socket server

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())
app.use(appRouter)

server.listen(3000, () => {
  console.log("Server started on port 3000")
})
