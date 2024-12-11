import express from "express";
import { getAll } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/user", getAll);

export default (app) => {
  app.use(router);
};
