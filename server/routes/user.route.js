import express from "express"
import { catchErrorHandler } from "../middlewares/catch-error.js"
import {
  deleteProducts,
  updateProduct
} from "../controllers/products.controller.js"
import { validateData } from "../middlewares/validate.js"
import {
  insertProductSchema,
  updateProductSchema
} from "../schema/product.schema.js"
import {
  getListUsers,
  loginUser,
  registerUser
} from "../controllers/user.controller.js"
import { loginUserSchema, registerUserSchema } from "../schema/user.schema.js"
import { authorization } from "../middlewares/authorization.js"

export const userRoute = express.Router()

userRoute.get("/", authorization, catchErrorHandler(getListUsers))

userRoute.post(
  "/register",
  validateData(registerUserSchema),
  catchErrorHandler(registerUser)
)

userRoute.post(
  "/login",
  validateData(loginUserSchema),
  catchErrorHandler(loginUser)
)

userRoute.put(
  "/:id",
  validateData(updateProductSchema),
  catchErrorHandler(updateProduct)
)

userRoute.delete("/", catchErrorHandler(deleteProducts))
