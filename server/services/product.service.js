import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPaginationProducts = async (page, take) => {
  try {
    const skip = (page - 1) * take;

    const products = await prisma.product.findMany({
      skip: skip,
      take: take,
    });

    const totalRecord = await prisma.product.count();

    const totalPage = Math.ceil(totalRecord / take);

    return {
      products,
      currentPage: page,
      totalPage,
      recordPerPage: products.length,
      totalRecord,
    };
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

export const createProduct = async (newProduct) => {
  try {
    return await prisma.product.create({
      data: {
        image: newProduct.image,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: Number(newProduct.stock),
      },
    });
  } catch (error) {
    throw new Error("Failed to add product");
  }
};

export const updateProduct = async (updatedProduct, id) => {
  try {
    return await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: updatedProduct,
    });
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (id) => {
  try {
    return await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (error) {
    throw new Error("Failed to delete product due to not found");
  }
};
