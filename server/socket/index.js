import { verifyToken } from "../utils/token.util.js"
import { userEvent } from "./events/user.event.js"

export const socketConnection = (io) => {
  // middaleware to handle
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error("Authentication error"))
    }

    try {
      const decoded = verifyToken(token)
      socket.user = decoded.id
      socket.role = decoded.role
      next()
    } catch (err) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id)
    // handle event from client
    userEvent(socket)

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })
}
