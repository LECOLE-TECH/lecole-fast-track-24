import { updateUserSecretPhrase } from "../services/user.service.js";

export default function handleSocket(io) {
  io.on("connection", (socket) => {
    console.log("Connected");

    socket.on("update-secret-phrase", async (data) => {
      try {
        const { id, newSecretePhrase, editor } = data;
        if (editor.roles === "admin" || editor.user_id == id) {
          const resData = await updateUserSecretPhrase(
            id,
            newSecretePhrase,
            editor
          );

          if (resData == "User not found") {
            socket.emit("no-found-for-updating", { message: resData });
          } else if (
            resData == "You do not have right to edit this secret phrase"
          ) {
            socket.emit("no-right-for-updating", { message: resData });
          }

          io.emit("secret-phrase-updated", resData);
          socket.emit("success", {
            message: "Secret phrase updated successfully",
          });
        } else {
          socket.emit("error", {
            error:
              "You do not have permission to update this user's secret phrase",
          });
        }
      } catch (error) {
        console.error(error);
        socket.emit("error", { error: "Error Socket" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
