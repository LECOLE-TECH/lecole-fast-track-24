import { standardResponse } from "../config/response.config.js";
import { createUser, getUserByUsername } from "../services/user.service.js";
import { decryptPassword } from "../utils/crypto.util.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { username, secret_phrase, roles } = req.body;
  if (username && secret_phrase) {
    try {
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return standardResponse(
          res,
          400,
          null,
          "User credential already exists"
        );
      }
      const newUser = {
        username,
        secret_phrase,
        roles,
      };
      const registeredUser = await createUser(newUser);
      standardResponse(res, 201, registeredUser, "Register successfully");
    } catch (error) {
      standardResponse(res, 500, null, "Fail to register users api");
    }
  } else {
    standardResponse(res, 400, null, "Please enter your incredential");
  }
};

export const login = async (req, res) => {
  const { username, secret_phrase } = req.body;
  if (username && secret_phrase) {
    try {
      const existingUser = await getUserByUsername(username);
      if (!existingUser) {
        return standardResponse(res, 401, null, "Wrong username");
      } else {
        const decryptedPass = decryptPassword(existingUser.secret_phrase);
        if (secret_phrase === decryptedPass) {
          const accessToken = jwt.sign(
            {
              id: existingUser.user_id,
              username: existingUser.username,
              roles: existingUser.roles,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          req.session.loggedin = true;
          req.session.user = existingUser;
          standardResponse(res, 200, { accessToken }, "Login successfully");
        } else {
          standardResponse(res, 401, null, "Incorrect password");
        }
      }
    } catch (error) {
      standardResponse(res, 500, null, "Fail to login users api");
    }
  } else {
    standardResponse(res, 400, null, "Please enter your incredential");
  }
};
