import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { ErrorResponse, SuccessResponse } from "../utils/http-response.js"
import fuzzysort from "fuzzysort"
import { faker } from "@faker-js/faker"
import { db } from "../configs/db.config.js"

export const createProduct = async (req, res) => {
  const { name, description, price, stock, category, brand } = req.body
  const image = faker.image.urlPicsumPhotos(640, 480, undefined, true)

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
          return new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          ).send(res)
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
  const { page = 1, limit = 10, search = "" } = req.query

  const offset = (page - 1) * limit

  if (search.trim()) {
    const baseQuery = `
    SELECT * FROM products
    ORDER BY id DESC;
    `

    db.all(baseQuery, (err, products) => {
      if (err) {
        throw new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }

      const fuzzyResults = fuzzysort.go(search, products, { key: "name" })
      const matchedProducts = fuzzyResults.map((result) => result.obj)

      const paginatedResults = matchedProducts.slice(offset, offset + limit)

      const data = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: matchedProducts.length,
        totalPages: Math.ceil(matchedProducts.length / limit),
        items: paginatedResults
      }

      return new SuccessResponse("List of products", StatusCodes.OK, data).send(
        res
      )
    })
  } else {
    const countQuery = `select count(*) as total from products where id >= 0;`
    const baseQuery = ` SELECT * FROM products ORDER BY id DESC LIMIT ? OFFSET ?;`

    db.all(baseQuery, [limit, offset], (err, products) => {
      if (err) {
        throw new ErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      }

      db.get(countQuery, (err, row) => {
        if (err) {
          throw new ErrorResponse(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        }

        const total = row.total
        const totalPages = Math.ceil(total / limit)
        const data = {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          totalPages: totalPages,
          items: products
        }

        return new SuccessResponse(
          "List of products",
          StatusCodes.OK,
          data
        ).send(res)
      })
    })
  }
}

export const updateProduct = async (req, res) => {
  const { id } = req.params
  const { name, description, price, stock, category, brand, image } = req.body

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
