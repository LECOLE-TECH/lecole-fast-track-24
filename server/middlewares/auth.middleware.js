import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { standardResponse } from "../config/response.config.js";
import { getUserByUsername } from "../services/user.service.js";

dotenv.config();

export const loggedin = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.json({ message: "Login failed" });
  }
};

export const isAuth = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    res.json({ message: "Login successfully " });
  } else {
    next();
  }
};

export const authenticateJWT = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (accessToken) {
    const logedInUser = jwt.verify(accessToken, process.env.JWT_SECRET);
    const existingUser = await getUserByUsername(logedInUser.username);
    if (existingUser) {
      req.user = logedInUser;
      next();
    } else {
      standardResponse(res, 401, null, "Unauthorized");
    }
  } else {
    standardResponse(res, 401, null, "Unauthorized");
  }
};

export const authorization = (req, res, next) => {
  const user = req.user;
  if (user.roles === "admin") {
    next();
  } else {
    standardResponse(res, 401, null, "Unauthorized");
  }
};
