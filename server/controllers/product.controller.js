import {
  paginationResponse,
  standardResponse,
} from "../config/response.config.js";
import {
  getPaginationProducts,
  getProductById,
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
