import axios from "axios";

const server = "http://localhost:3000";

export const getProduct = async (req, res) => {
    try {
        const response = await axios.get(`${server}/api/product`);
        return response.data;
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching product data");
    }
}
export const  postProduct = async (product) => {
    try {
        const response = await axios.post(`${server}/api/product`, product);
        return response.data;
    } catch (error) {
        console.error(error);
        error.status(500).send("Error posting product data");
    }
}
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${server}/api/product/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        error.status(500).send("Error deleting product data");
    }
}
export const updateProduct = async (id, product) => {
    try {
        const response = await axios.put(`${server}/api/product/${id}`, product);
        return response.data;
    } catch (error) {
        console.error(error);
        error.status(500).send("Error updating product data");
    }
}
