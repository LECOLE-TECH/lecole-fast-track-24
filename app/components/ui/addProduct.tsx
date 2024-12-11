import React, { useState } from 'react';
import { productApi } from '../../api/productApi';
import type { Product } from '../../types/interfacePro';
import { toast } from 'react-toastify';

interface AddProductProps {
  onClose: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // Thêm prop setProducts
}

export default function AddProduct({ onClose, setProducts }: AddProductProps) {
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addedProduct = await productApi.post(newProduct);  
      toast.success('Add product successfully!');
      setProducts(prevProducts => [...prevProducts, addedProduct]);
      onClose();  
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add new product</h2>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Thêm Sản Phẩm
        </button>
      </form>
    </div>
  );
}
