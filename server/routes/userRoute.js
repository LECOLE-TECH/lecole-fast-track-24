import express from "express"
import { getUsers, loginUser, logout, registerUser, updateSecretPhrase } from "../controllers/userController.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { body } from "express-validator";

const userRouter = express.Router()

userRouter.get("/users",verifyTokenMiddleware, getUsers)

userRouter.post("/register",[
    body("username")
    .isLength({min:3})
    .withMessage("Username must have at least 3 characters"),
    body("secret_phrase")
    .isLength({min:8})
    .withMessage("Password must have at least 8 characters"),
    body("roles")
    .isIn(["user", "admin"])
    .withMessage("Roles must be either 'user' or 'admin'")
], registerUser)

userRouter.post("/login",verifyTokenMiddleware,loginUser)

userRouter.post("/logout",logout)

userRouter.put("/update-secret",[
    verifyTokenMiddleware,
    body("secret_phrase")
    .isLength({min:8})
    .withMessage("Password must have at least 8 characters")
],updateSecretPhrase)

export default userRouter