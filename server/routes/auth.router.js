import express from "express";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/api/auth/register", register);

export default (app) => {
  app.use(router);
};
