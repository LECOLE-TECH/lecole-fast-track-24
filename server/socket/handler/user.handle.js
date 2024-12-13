import { faker } from "@faker-js/faker"
import { db } from "../../configs/db.config.js"
import { ErrorResponse, SuccessResponse } from "../../utils/http-response.js"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { encryptMessage } from "../../utils/cryptography.util.js"

export const updateUserHandler = async ({ id, secret }, socket) => {
  const query = `
  UPDATE users
  SET secret = ?
  WHERE id = ?
`

  db.run(query, [secret, id], function (err) {
    if (err) {
      console.error(err)
      socket.emit(
        "update-user-response",
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
      return
    }

    if (this.changes === 0) {
      socket.emit(
        "update-user-response",
        new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
      )
      return
    }

    socket.emit(
      "update-user-response",
      new SuccessResponse("User has been updated successfully", StatusCodes.OK)
    )
  })
}

export const deleteUserHandler = async ({ ids }, socket) => {
  // delete multiple users

  const query = `
  DELETE FROM users
  WHERE id IN (${ids.join(",")})
`
  db.run(query, function (err) {
    if (err) {
      console.error(err)
      socket.emit(
        "delete-user-response",
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
      return
    }

    if (this.changes === 0) {
      socket.emit(
        "delete-user-response",
        new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
      )
      return
    }

    socket.emit(
      "delete-user-response",
      new SuccessResponse("User has been deleted successfully", StatusCodes.OK)
    )
  })
}

export const createUserHandler = async ({ username, role, secret }, socket) => {
  const avatar = faker.image.urlPicsumPhotos(640, 480, undefined, true)
  const query = `
  INSERT INTO users (username, role, secret, avatar)
  VALUES (?, ?, ?, ?)
`

  db.run(query, [username, role, secret, avatar], function (err) {
    if (err) {
      console.error(err)
      socket.emit(
        "create-user-response",
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
      return
    }
    // retrieve new user
    const selectQuery = `SELECT * FROM users WHERE id = ?`
    db.get(selectQuery, [this.lastID], (err, user) => {
      if (err) {
        socket.emit(
          "create-user-response",
          new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        )
        return
      }
      const data = encryptMessage(user)
      socket.emit("create-user-response", data)
    })
  })
}
