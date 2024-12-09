import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { ErrorResponse, SuccessResponse } from "../utils/http-response.js"
import { db } from "../configs/db.config.js"

export const createProduct = async (req, res) => {
  const { name, description, price, stock, category, image, brand } = req.body

  const insertQuery = `
    INSERT INTO products (name, description, price, stock, category, image, brand)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.serialize(() => {
    db.run(
      insertQuery,
      [name, description, price, stock, category, image, brand],
      function (err) {
        if (err) {
          const error = new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
          return error.send(res)
        }

        const selectQuery = `
          SELECT * FROM products WHERE id = ?
        `
        db.get(selectQuery, [this.lastID], (err, product) => {
          if (err) {
            const error = new ErrorResponse(
              ReasonPhrases.INTERNAL_SERVER_ERROR,
              StatusCodes.INTERNAL_SERVER_ERROR
            )
            return error.send(res)
          }

          const success = new SuccessResponse(
            "Create product successfully",
            StatusCodes.CREATED,
            product
          )
          return success.send(res)
        })
      }
    )
  })
}

export const getListProducts = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query

  const offset = (page - 1) * limit

  const baseQuery = `
  SELECT * FROM products
`
  const whereClause = search.length > 0 ? `WHERE name LIKE ?` : ``
  const paginationClause = `LIMIT ? OFFSET ?`

  const fullQuery = `${baseQuery} ${whereClause} ${paginationClause}`

  const params =
    search.length > 0
      ? [`%${search}%`, parseInt(limit), offset]
      : [parseInt(limit), offset]

  db.all(fullQuery, params, (err, rows) => {
    if (err) {
      throw new ErrorResponse(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }

    const countQuery = `
        SELECT COUNT(*) AS total FROM products
      `
    const countWhereClause = search ? `WHERE name LIKE ?` : ``
    const fullCountQuery = `${countQuery} ${countWhereClause}`

    const countParams = search ? [`%${search}%`] : []

    db.get(fullCountQuery, countParams, (err, result) => {
      if (err) {
        throw new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }

      const total = result.total
      const totalPages = Math.ceil(total / limit)

      const data = {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        items: rows
      }

      return new SuccessResponse("List of products", StatusCodes.OK, data).send(
        res
      )
    })
  })
}

export const updateProduct = async (req, res) => {
  const { id } = req.params
  const { name, description, price, stock, category, image, brand } = req.body

  const query = `
    UPDATE products
    SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ?, brand = ?
    WHERE id = ?
  `

  db.run(
    query,
    [name, description, price, stock, category, image, brand, id],
    function (err) {
      if (err) {
        throw new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }
      if (this.changes === 0) {
        throw new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
      }

      const data = {
        id
      }
      return new SuccessResponse(
        "Update product successfully",
        StatusCodes.OK,
        data
      ).send(res)
    }
  )
}

export const deleteProducts = async (req, res) => {
  const { ids } = req.body

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ErrorResponse(
      "Invalid input: 'ids' should be a non-empty array",
      StatusCodes.BAD_REQUEST
    )
  }

  const placeholders = ids.map(() => "?").join(", ")

  const query = `DELETE FROM products WHERE id IN (${placeholders})`

  db.run(query, ids, function (err) {
    if (err) {
      throw new ErrorResponse(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
    if (this.changes === 0) {
      throw new ErrorResponse(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const data = {
      deletedIds: ids,
      affectedRows: this.changes
    }

    return new SuccessResponse(
      "Deleted products successfully",
      StatusCodes.OK,
      data
    ).send(res)
  })
}
