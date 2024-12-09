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
  insertProductsSchema,
  updateProductsSchema
} from "../schema/product.schema.js"

export const productRoute = express.Router()

productRoute.get("/", catchErrorHandler(getListProducts))

productRoute.post(
  "/",
  validateData(insertProductsSchema),
  catchErrorHandler(createProduct)
)

productRoute.put(
  "/",
  validateData(updateProductsSchema),
  catchErrorHandler(updateProduct)
)

productRoute.delete("/", catchErrorHandler(deleteProducts))
