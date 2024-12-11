import { getAllUsers } from "../services/user.service.js";

export const getAll = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json("Fail api fetch all users");
  }
};
