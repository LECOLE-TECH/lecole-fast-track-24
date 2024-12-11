import {
  paginationResponse,
  standardResponse,
} from "../config/response.config.js";
import {
  getPaginationUsers,
  getUserByUsername,
} from "../services/user.service.js";

export const getAll = async (req, res) => {
  const { page = 1, take = 10 } = req.query;
  try {
    const users = await getPaginationUsers(Number(page), Number(take));
    paginationResponse(
      res,
      200,
      users.users,
      `Get all users successfully`,
      users.currentPage,
      users.totalPage,
      users.recordPerPage,
      users.totalRecord
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
