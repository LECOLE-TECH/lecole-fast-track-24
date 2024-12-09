import express from "express"
import { productRoute } from "./products.route.js"
import { insertProductsDummy } from "../utils/dummy-data.js"
import { db } from "../configs/db.config.js"
export const appRoute = express.Router()

insertProductsDummy(db)
appRoute.use("/products", productRoute)
