import express from "express"
import { productRoute } from "./products.route.js"
import {
  generateTodosTable,
  insertProductsDummy,
  insertUsersDummy
} from "../utils/dummy-data.js"
import { db } from "../configs/db.config.js"
import { userRoute } from "./user.route.js"
import todoRoute from "./todo.route.js"
export const appRoute = express.Router()

insertProductsDummy(db)
insertUsersDummy(db)
generateTodosTable(db)
appRoute.use("/products", productRoute)
appRoute.use("/users", userRoute)
appRoute.use("/todos", todoRoute)
