import { PrismaClient } from "@prisma/client";
import { encryptPassword } from "../utils/crypto.util";

const prisma = new PrismaClient();

export const getPaginationUsers = async (page, take) => {
  try {
    const skip = (page - 1) * take;

    const users = await prisma.user.findMany({
      skip: skip,
      take: take,
    });

    const totalRecord = await prisma.user.count();

    const totalPage = Math.ceil(totalRecord / take);

    return {
      users,
      currentPage: page,
      totalPage,
      recordPerPage: users.length,
      totalRecord,
    };
  } catch (error) {
    throw new Error("Failed to fetch users from database.");
  }
};

export const getUserByUsername = async (username) => {
  try {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch user with ${username} from database`);
  }
};

export const createUser = async (newUser) => {
  const encryptedPass = encryptPassword(newUser.secret_phrase);
  try {
    return await prisma.user.create({
      data: {
        username: newUser.username,
        secret_phrase: encryptedPass,
        roles: newUser.roles,
      },
    });
  } catch (error) {
    throw new Error("Failed to add product");
  }
};
