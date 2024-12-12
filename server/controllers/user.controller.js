import {
  paginationResponse,
  standardResponse,
} from "../config/response.config.js";
import {
  getPaginationUsers,
  getUserByUsername,
  updateUserSecretPhrase,
} from "../services/user.service.js";

export const getAll = async (req, res) => {
  const { page = 1, take = 10 } = req.query;
  try {
    const data = await getPaginationUsers(Number(page), Number(take));
    const loggedInUser = req.session.user;
    let filterUsers;
    if (!loggedInUser) {
      filterUsers = data.users.map((user) => ({
        user_id: user.user_id,
        username: user.username,
      }));
    } else if (loggedInUser.roles == "user") {
      filterUsers = data.users.map((user) => ({
        user_id: user.user_id,
        username: user.username,
        roles: user.roles,
      }));
    } else if (loggedInUser.roles == "admin") {
      filterUsers = data.users;
    }
    paginationResponse(
      res,
      200,
      filterUsers,
      `Get all users successfully`,
      data.currentPage,
      data.totalPage,
      data.recordPerPage,
      data.totalRecord
    );
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch users api");
  }
};

export const getByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return standardResponse(
        res,
        404,
        null,
        `No user with username: ${username} found`
      );
    }
    standardResponse(
      res,
      200,
      user,
      `Get user with username: ${username} successfully`
    );
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch user api");
  }
};

export const updateSecretPhrase = async (req, res) => {
  const { id } = req.params;
  const { new_secret_phrase } = req.body;
  const editor = req.user;
  try {
    const data = await updateUserSecretPhrase(id, new_secret_phrase, editor);
    if (data == "User not found") {
      standardResponse(res, 404, null, data);
    } else if (data == "You do not have right to edit this secret phrase") {
      standardResponse(res, 401, null, data);
    }
    standardResponse(res, 201, data, "Update secret phrase successfully");
  } catch (error) {
    standardResponse(res, 500, null, "Fail to update secret phrase api");
  }
};
