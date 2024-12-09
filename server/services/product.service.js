import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async () => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    throw new Error("Failed to fetch products from database.");
  }
};

export const getProductById = async (inputId) => {
  try {
    return await prisma.product.findUnique({
      where: {
        id: Number(inputId),
      },
    });
  } catch (error) {
    throw new Error(`No product with ${inputId} found`);
  }
};
