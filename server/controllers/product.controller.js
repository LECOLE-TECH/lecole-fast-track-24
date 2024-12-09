import {
  paginationResponse,
  standardResponse,
} from "../config/response.config.js";
import {
  createProduct,
  deleteProduct,
  getPaginationProducts,
  getProductById,
  updateProduct,
} from "../services/product.service.js";

export const getPagination = async (req, res) => {
  const { page = 1, take = 10 } = req.query;
  try {
    const products = await getPaginationProducts(Number(page), Number(take));
    paginationResponse(
      res,
      200,
      products.products,
      `Get all products successfully`,
      products.currentPage,
      products.totalPage,
      products.recordPerPage,
      products.totalRecord
    );
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch products");
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      return standardResponse(
        res,
        404,
        null,
        `No product with id: ${id} found`
      );
    }
    standardResponse(
      res,
      200,
      product,
      `Get product with id: ${id} successfully`
    );
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch product");
  }
};

export const create = async (req, res) => {
  const { image, name, description, price, stock } = req.body;
  const newProduct = {
    image,
    name,
    description,
    price,
    stock,
  };
  try {
    const product = await createProduct(newProduct);
    if (!product) {
      return standardResponse(
        res,
        400,
        null,
        "Fail to create product due to bad request"
      );
    }
    standardResponse(res, 201, product, "Create product successfully");
  } catch (error) {
    standardResponse(res, 500, null, "Fail to create product due to server");
  }
};

export const udpate = async (req, res) => {
  const id = req.params.id;
  const updatedProduct = req.body;
  try {
    const product = await updateProduct(updatedProduct, id);
    if (!product) {
      return standardResponse(
        res,
        400,
        null,
        "Fail to update product due to bad request"
      );
    }
    standardResponse(res, 201, product, "Update product successfully");
  } catch (error) {
    standardResponse(res, 500, null, "Fail to update product due to server");
  }
};

export const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const isDeleted = await deleteProduct(id);
    if (!isDeleted) {
      return standardResponse(res, 400, null, "Fail to delete product");
    }
    standardResponse(res, 201, isDeleted, "Delete product successfully");
  } catch (error) {
    standardResponse(res, 404, null, "Fail to delete product due to not found");
  }
};
