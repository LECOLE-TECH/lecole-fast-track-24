import { Server } from "socket.io";

let io = null;

export const initializeSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });


  console.log("Socket.IO server initialized");
  return io;
};

export const getIoInstance = () => {
  if (!io) {
    throw new Error("Socket.IO instance not initialized");
  }
  return io;
};