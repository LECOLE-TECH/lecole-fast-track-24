import { standardResponse } from "../config/response.config.js";
import { getAllProducts, getProductById } from "../services/product.service.js";

export const getAll = async (req, res) => {
  try {
    const products = await getAllProducts();
    standardResponse(res, 200, products, `Get all products successfully`);
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch products");
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      return standardResponse(res, 404, null, `No product with id: ${id} found`);
    }
    standardResponse(res, 200, product, `Get product with id: ${id} successfully`);
  } catch (error) {
    standardResponse(res, 500, null, "Fail to fetch product");
  }
};
