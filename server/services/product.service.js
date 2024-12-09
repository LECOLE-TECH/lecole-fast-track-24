import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async () => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    throw new Error("Failed to fetch products from database.");
  }
};
