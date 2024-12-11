import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { productApi } from '../../api/productApi';
import { useNavigate } from 'react-router-dom'; 
import AddProduct from '../../../app/components/ui/addProduct';
import EditProduct from "../../components/ui/editProduct";
import { toast } from 'react-toastify';

export default function TrackOne() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); 
  const navigate = useNavigate();

  // Fetch the list of products from the API
  const fetchProducts = async () => {
    try {
      const data = await productApi.get();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle the edit button click
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true); 
  };

  // Handle the delete button click
  const handleDelete = async (productId: any) => {
    try {
      await productApi.delete(productId);
      toast.success('Product deleted successfully!');
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Close modal and reset the selected product
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 p-8 shadow-md sm:rounded-lg">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Product List
        </h2>
      </header>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your product inventory is just a click away.
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          Manage, update, and add products easily! Make your workflow seamless with our intuitive interface.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                <td className="px-6 py-4 text-left">{product.id}</td>
                <td className="px-6 py-4 text-left">{product.name}</td>
                <td className="px-6 py-4 text-left">${product.price}</td>
                <td className="px-6 py-4 text-left">{product.stock}</td>
                <td className="px-6 py-4 text-left">{product.description}</td>
                <td className="flex space-x-2 px-6 py-4">
                  <button className="bg-blue-500 text-white py-1 px-2 rounded-full">
                    <FaEdit onClick={() => handleEdit(product)} />
                  </button>
                  <button className="bg-red-500 text-white py-1 px-2 rounded-full">
                    <FaTrashAlt onClick={() => handleDelete(product.id)} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            {selectedProduct ? (
              <EditProduct
                product={selectedProduct}
                onClose={closeModal}
                setProducts={setProducts} 
              />
            ) : (
              <AddProduct onClose={closeModal} setProducts={setProducts} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
