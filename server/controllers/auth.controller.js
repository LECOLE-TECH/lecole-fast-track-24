import { standardResponse } from "../config/response.config.js";
import { createUser } from "../services/user.service.js";

export const register = async (req, res) => {
  const { username, secret_phrase, roles } = req.body;
  console.log();
  if (username && secret_phrase) {
    try {
      const newUser = {
        username,
        secret_phrase,
        roles,
      };
      const registeredUser = await createUser(newUser);
      standardResponse(res, 201, registeredUser, "Register successfully");
    } catch (error) {
      console.log(error);
      standardResponse(res, 500, null, "Fail to register users api");
    }
  } else {
    standardResponse(res, 400, null, "Please enter your incredential");
  }
};
