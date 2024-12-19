import express from "express"
import cors from "cors"
import { corsOptions } from "./configs/cors.config.js"
import { appRoute } from "./routes/index.js"
import { notFoundHandler } from "./middlewares/not-found.js"
import { errorHandler } from "./middlewares/error-handler.js"
import helmet from "helmet"
import { connectDatabase } from "./configs/db.config.js"
import compression from "compression"

export const expressApplication = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // hide the server information
  app.use(helmet())

  // compress the response
  app.use(compression())

  // enable cors
  app.use(cors(corsOptions))

  // connect db
  connectDatabase()

  // use the app router
  app.use("/lecole/api/v1", appRoute)
  app.use(notFoundHandler)
  app.use(errorHandler)
}
