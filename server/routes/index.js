import express from "express"
import { productRoute } from "./products.route.js"
import { insertProductsDummy, insertUsersDummy } from "../utils/dummy-data.js"
import { db } from "../configs/db.config.js"
import { userRoute } from "./user.route.js"
export const appRoute = express.Router()

insertProductsDummy(db)
insertUsersDummy(db)
appRoute.use("/products", productRoute)
appRoute.use("/users", userRoute)
