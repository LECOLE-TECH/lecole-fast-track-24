import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { ErrorResponse, SuccessResponse } from "../utils/http-response.js"
import fuzzysort from "fuzzysort"
import { faker } from "@faker-js/faker"
import { db } from "../configs/db.config.js"
import { generateToken } from "../utils/token.util.js"

export const registerUser = async (req, res, next) => {
  const { username, role, secret } = req.body

  const avatar = faker.image.urlPicsumPhotos(640, 480, undefined, true)

  const selectExistingUserQuery = `SELECT * FROM users WHERE username = ?`

  db.get(selectExistingUserQuery, [username], (err, existingUser) => {
    if (err) {
      return next(
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
    }

    if (existingUser) {
      return next(
        new ErrorResponse("User already exists", StatusCodes.CONFLICT)
      )
    }

    const insertQuery = `
      INSERT INTO users (avatar, username, role, secret)
      VALUES (?, ?, ?, ?)
    `

    db.serialize(() => {
      db.run(insertQuery, [avatar, username, role, secret], function (err) {
        if (err) {
          return next(
            new ErrorResponse(
              ReasonPhrases.INTERNAL_SERVER_ERROR,
              StatusCodes.INTERNAL_SERVER_ERROR
            )
          )
        }

        const selectQuery = `SELECT * FROM users WHERE id = ?`

        db.get(selectQuery, [this.lastID], (err, user) => {
          if (err) {
            return next(
              new ErrorResponse(
                ReasonPhrases.INTERNAL_SERVER_ERROR,
                StatusCodes.INTERNAL_SERVER_ERROR
              )
            )
          }

          return new SuccessResponse(
            "User created successfully",
            StatusCodes.CREATED,
            user
          ).send(res)
        })
      })
    })
  })
}

export const loginUser = async (req, res, next) => {
  const { username, secret } = req.body

  const selectUserQuery = `SELECT * FROM users WHERE username = ?`

  db.get(selectUserQuery, [username], (err, user) => {
    if (err) {
      return next(
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
    }

    if (!user || user.secret !== secret) {
      return next(
        new ErrorResponse(
          "Invalid username or secret phrase",
          StatusCodes.UNAUTHORIZED
        )
      )
    }

    const data = {
      token: generateToken({ id: user.id, role: user.role }),
      ...user
    }

    return new SuccessResponse("Login successful", StatusCodes.OK, data).send(
      res
    )
  })
}

export const getListUsers = async (req, res, next) => {
  const { page = 1, limit = 10, search = "" } = req.query

  const role = req.role || ""

  const offset = (page - 1) * limit

  if (search.trim()) {
    const baseQuery =
      role === "admin"
        ? `

        SELECT * FROM users
    ORDER BY id DESC;
    `
        : role === "user"
        ? `    SELECT avatar, username, role FROM users
    ORDER BY id DESC;
    `
        : `
    SELECT avatar, username FROM users
    ORDER BY id DESC;
    `

    db.all(baseQuery, (err, products) => {
      if (err) {
        return next(
          new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        )
      }

      const fuzzyResults = fuzzysort.go(search, products, { key: "username" })
      const matchedUser = fuzzyResults.map((result) => result.obj)

      const paginatedResults = matchedUser.slice(offset, offset + limit)

      const data = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: matchedUser.length,
        totalPages: Math.ceil(matchedUser.length / limit),
        items: paginatedResults
      }

      return new SuccessResponse("List of user", StatusCodes.OK, data).send(res)
    })
  } else {
    const countQuery = `select count(*) as total from users where id >= 0;`

    const baseQuery =
      role === "admin"
        ? `

    SELECT * FROM users
ORDER BY id DESC LIMIT ? OFFSET ? ;
`
        : role === "user"
        ? `    SELECT avatar, username, role FROM users
ORDER BY id DESC LIMIT ? OFFSET ?;
`
        : `
SELECT avatar, username FROM users
ORDER BY id DESC LIMIT ? OFFSET ?;
`

    db.all(baseQuery, [limit, offset], (err, users) => {
      if (err) {
        return next(
          new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        )
      }

      db.get(countQuery, (err, row) => {
        if (err) {
          return next(
            new ErrorResponse(
              ReasonPhrases.INTERNAL_SERVER_ERROR,
              StatusCodes.INTERNAL_SERVER_ERROR
            )
          )
        }

        const total = row.total
        const totalPages = Math.ceil(total / limit)
        const data = {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: totalPages,
          items: users
        }

        return new SuccessResponse("List of users", StatusCodes.OK, data).send(
          res
        )
      })
    })
  }
}

export const updateUser = async (req, res, next) => {
  const { id } = req.params
  const { secret } = req.body

  const query = `
    UPDATE users
    SET secret = ?
    WHERE id = ?
  `

  db.run(query, [secret, id], function (err) {
    if (err) {
      return next(
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
    }
    if (this.changes === 0) {
      return next(
        new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
      )
    }

    const data = {
      id
    }
    return new SuccessResponse(
      "Update user successfully",
      StatusCodes.OK,
      data
    ).send(res)
  })
}

export const deleteUser = async (req, res, next) => {
  const { ids } = req.body

  if (!Array.isArray(ids) || ids.length === 0) {
    return next(
      new ErrorResponse(
        "Invalid input: 'ids' should be a non-empty array",
        StatusCodes.BAD_REQUEST
      )
    )
  }

  const placeholders = ids.map(() => "?").join(", ")

  const query = `DELETE FROM user WHERE id IN (${placeholders})`

  db.run(query, ids, function (err) {
    if (err) {
      return next(
        new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      )
    }
    if (this.changes === 0) {
      return next(
        new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
      )
    }

    const data = {
      deletedIds: ids,
      affectedRows: this.changes
    }

    return new SuccessResponse(
      "Deleted user successfully",
      StatusCodes.OK,
      data
    ).send(res)
  })
}
