import { PrismaClient } from "@prisma/client";

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
