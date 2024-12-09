import express from "express"
import { catchErrorHandler } from "../middlewares/catch-error.js"
import { getListProducts } from "../controllers/products.controller.js"

export const productRoute = express.Router()

productRoute.get("/", catchErrorHandler(getListProducts))
