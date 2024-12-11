import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import type { Product } from '../../types/interfacePro';
import { toast } from 'react-toastify';

interface EditProductProps {
  product: Product;
  onClose: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function EditProduct({ product, onClose, setProducts }: EditProductProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const navigate = useNavigate();

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
  
    // Check if productId is a valid number
    if (productId === undefined || isNaN(productId)) {
      toast.error('Invalid product ID');
      return;
    }
  
    const updatedProduct = {
      ...editedProduct,
      price: editedProduct.price ?? 0,
      stock: editedProduct.stock ?? 0,
    };
  
    try {
      const response = await productApi.patch(productId, updatedProduct);
  
      toast.success('Product updated successfully!');
      setProducts(prevProducts => prevProducts.map(p => p.id === productId ? response : p));
      navigate('/track-one');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleEditProduct} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedProduct.name}
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
            value={editedProduct.description}
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
            value={editedProduct.price}
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
            value={editedProduct.stock}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
