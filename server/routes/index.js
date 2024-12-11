import express from "express"
import userRouter from "./userRoute.js"


const appRouter = express.Router()

appRouter.use("/api",userRouter)

export default appRouter