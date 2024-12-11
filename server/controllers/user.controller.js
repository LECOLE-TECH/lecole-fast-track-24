import {
  paginationResponse,
  standardResponse,
} from "../config/response.config.js";
import { getPaginationUsers } from "../services/user.service.js";

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
    standardResponse(res, 500, null, "Fail to fetch users");
  }
};
