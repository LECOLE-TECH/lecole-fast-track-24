import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);

export default (app) => {
  app.use(router);
};
