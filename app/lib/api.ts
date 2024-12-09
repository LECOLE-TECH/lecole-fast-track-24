import type { Product } from "./model";

type method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type endpoint = "product" | string;

// Send request to the server
const sendRequest = async (
  endpoint: endpoint,
  method: method,
  data?: any
): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        cache: "no-cache",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get all products
export const getProduct = async (): Promise<Product[] | null> => {
  try {
    const data = await sendRequest("product", "GET");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Get a single product
export const createProduct = async (product: Product): Promise<boolean> => {
  try {
    const data = await sendRequest("product", "POST", product);
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Create a new product
export const updateProduct = async (product: Product): Promise<boolean> => {
  try {
    const data = await sendRequest(`product/${product.id}`, "PATCH", product);
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  console.log(id);
  try {
    const data = await sendRequest(`product/${id}`, "DELETE");
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
