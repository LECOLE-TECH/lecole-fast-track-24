import express from "express"
import { catchErrorHandler } from "../middlewares/catch-error.js"
import {
  createProduct,
  deleteProducts,
  getListProducts,
  updateProduct
} from "../controllers/products.controller.js"
import { validateData } from "../middlewares/validate.js"
import {
  insertProductSchema,
  updateProductSchema
} from "../schema/product.schema.js"

export const productRoute = express.Router()

productRoute.get("/", catchErrorHandler(getListProducts))

productRoute.post(
  "/",
  validateData(insertProductSchema),
  catchErrorHandler(createProduct)
)

productRoute.put(
  "/:id",
  validateData(updateProductSchema),
  catchErrorHandler(updateProduct)
)

productRoute.delete("/", catchErrorHandler(deleteProducts))
