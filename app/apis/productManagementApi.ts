const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getPaginationProduct = async () => {
  try {
    const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product: ", error);
    throw error;
  }
};

export const getProductById = async (id: Number) => {
  try {
    const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orchids:", error);
    throw error;
  }
};
