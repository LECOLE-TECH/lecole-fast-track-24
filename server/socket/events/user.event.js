import { decryptMessage } from "../../utils/cryptography.util.js"
import {
  createUserHandler,
  deleteUserHandler,
  updateUserHandler
} from "../handler/user.handle.js"

export const userEvent = (socket) => {
  socket.on("update-user", (encryptedData) => {
    try {
      const decryptedData = decryptMessage(encryptedData)
      updateUserHandler(decryptedData, socket)
    } catch (error) {
      console.error("Decryption error:", error)
      socket.emit("updateUserResponse", {
        success: false,
        message: "Failed to decrypt data"
      })
    }
  })

  socket.on("delete-user", (encryptedData) => {
    try {
      const decryptedData = decryptMessage(encryptedData)
      deleteUserHandler(decryptedData, socket)
    } catch (error) {
      console.error("Decryption error:", error)
      socket.emit("updateUserResponse", {
        success: false,
        message: "Failed to decrypt data"
      })
    }
  })

  socket.on("create-user", (encryptedData) => {
    try {
      const decryptedData = decryptMessage(encryptedData)
      createUserHandler(decryptedData, socket)
    } catch (error) {
      console.error("Decryption error:", error)
      socket.emit("updateUserResponse", {
        success: false,
        message: "Failed to decrypt data"
      })
    }
  })
}
