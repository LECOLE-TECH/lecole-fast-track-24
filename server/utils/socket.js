import todosService from "../services/todos.service.js";

export default function handleSocket(io) {
  io.on("connection", (socket) => {
    console.log("Connected");

    io.emit("user-connect-server", { message: "Server Connected" });

    socket.on("online-auto-sync", async (data) => {
      if (!Array.isArray(data)) {
        socket.emit("fail-to-sync", {
          message: "Invalid data to sync with back-end",
        });
      }

      const resData = await todosService.syncMultiTodo(data);
      if (!Array.isArray(resData)) {
        socket.emit("sync-process-fail", {
          message: "Fail when syncing with back-end",
        });
      } else {
        io.emit("sync-todos-from-server", {
          message: "Sync task successfully",
        });
      }
    });

    socket.emit("user-disconnect-server", { message: "Disconnected Server" });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
