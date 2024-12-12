import express from "express";
import {
  getAll,
  getByUsername,
  getRevealPass,
  updateSecretPhrase,
} from "../controllers/user.controller.js";
import {
  authenticateJWT,
  authorization,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/api/user", getAll);
router.get("/api/user/:username", getByUsername);
router.get("/api/user/reveal-pass/:id", getRevealPass);
router.patch("/api/user/:id", authenticateJWT, updateSecretPhrase);

export default (app) => {
  app.use(router);
};
