import type { Product } from "~/types/product";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/product`;

interface PaginationResponse<T> {
  code: number;
  message: string;
  data: T[];
  currentPage: number;
  totalPage: number;
  recordPerPage: number;
  totalRecord: number;
}

export const getPaginationProduct = async (
  page: number = 1,
  take: number = 10
): Promise<PaginationResponse<Product>> => {
  try {
    const response = await fetch(`${baseUrl}?page=${page}&take=${take}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating product: ", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};
