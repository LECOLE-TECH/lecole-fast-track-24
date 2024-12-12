import express from "express";
import http from "http";
import { Server } from "socket.io";
import funcUserRouter from "./routes/user.router.js";
import funcAuthRouter from "./routes/auth.router.js";

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("update-secret-phrase", (data) => {
    const { userId, newSecretPhrase, actorId } = data;
    console.log(data);

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [actorId],
      (err, actor) => {
        if (err) {
          socket.emit("error", { error: "Database error" });
          console.log(err);
          return;
        }

        if (!actor) {
          socket.emit("error", { error: `Actor not found: ${actorId}` });
          console.log(`Actor not found: ${actorId}`);
          return;
        }

        if (actor.roles === "admin" || actorId === userId) {
          db.run(
            "UPDATE users SET secret_phrase = ? WHERE username = ?",
            [newSecretPhrase, userId],
            (err) => {
              if (err) {
                socket.emit("error", {
                  error: "Failed to update secret phrase",
                });
                console.log(err);
                return;
              }

              io.emit("secret-phrase-updated", {
                userId,
                newSecretPhrase,
              });
              socket.emit("success", {
                message: "Secret phrase updated successfully",
              });
              console.log("Secret phrase updated successfully");
            }
          );
        } else {
          socket.emit("error", {
            error:
              "You do not have permission to update this user's secret phrase",
          });
          console.log(
            `You do not have permission to update this user's secret phrase: ${actorId}, ${actor.roles}`
          );
        }
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

funcUserRouter(app);
funcAuthRouter(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
