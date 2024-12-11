import axios from 'axios';
import type { Product, ProductApi } from '../types/interfacePro';

const server = 'http://localhost:3000';

const apiRequest = async <T>(method: string, url: string, data: Product | null = null): Promise<T> => {
  try {
    const config = {
      method,
      url,
      data,
      headers: data ? { 'Content-Type': 'application/json' } : undefined, // Đặt header cho JSON
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error);
    throw new Error("API request failed");
  }
};

export const productApi: ProductApi = {
  get: () => apiRequest<Product[]>('get', `${server}/api/product`),
  post: (product: Product) => apiRequest<Product>('post', `${server}/api/product`, product),  // Gửi đối tượng Product
  delete: (id: number) => apiRequest<void>('delete', `${server}/api/product/${id}`),
  patch: (id: number, product: Product) => apiRequest<Product>('patch', `${server}/api/product/${id}`, product),
};
