import express from "express";
import {
  getAll,
  getByUsername,
  updateSecretPhrase,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/api/user", getAll);
router.get("/api/user/:username", getByUsername);
router.patch("/api/user/:id", authenticateJWT, updateSecretPhrase);

export default (app) => {
  app.use(router);
};
