import express from "express"
import { expressApplication } from "./app.js"
import { createServer } from "http"
import { Server } from "socket.io"
import { socketConnection } from "./socket/index.js"

const app = express()
const port = 3000

expressApplication(app)

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
})

// Listen for socket connections
socketConnection(io)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
