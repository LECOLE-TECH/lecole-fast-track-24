import { PrismaClient } from "@prisma/client";
import { decryptPassword, encryptPassword } from "../utils/crypto.util.js";

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

export const getUserRevealPass = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!user) {
      return "Not found";
    }
    const revealPassUser = {
      ...user,
      secret_phrase: decryptPassword(user.secret_phrase),
    };
    return revealPassUser;
  } catch (error) {
    throw new Error("Failed to fetch reveal pass");
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

export const updateUserSecretPhrase = async (id, newSecret, editor) => {
  console.log(`id la: ${id}`);
  console.log(`newSecret la: ${newSecret}`);
  console.log(`editor la: ${JSON.stringify(editor)}`);
  try {
    if (
      editor === undefined ||
      (editor.roles == "user" && editor.user_id !== id)
    ) {
      return "You do not have right to edit this secret phrase";
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!existingUser) {
      return "User not found";
    }
    return await prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        secret_phrase: encryptPassword(newSecret),
      },
    });
  } catch (error) {
    throw new Error("Failed to update secret");
  }
};
