import express from "express";
import { getAll, getByUsername } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/user", getAll);
router.get("/api/user/:username", getByUsername);

export default (app) => {
  app.use(router);
};
