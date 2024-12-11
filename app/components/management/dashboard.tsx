import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getPaginationProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "~/apis/productManagementApi";
import type { Product } from "~/types/product";
import ProductTable from "./productTable";
import ProductModal from "./productModal";
import DeleteConfirmationModal from "./deleteConfirmModal";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
});

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number) => {
    try {
      const response = await getPaginationProduct(page);
      setProducts(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        await fetchProducts(currentPage);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (selectedProduct) {
          await updateProduct(selectedProduct.id, values);
        } else {
          await createProduct(values);
        }
        await fetchProducts(currentPage);
        setIsModalOpen(false);
        resetForm();
      } catch (error) {
        console.error("Error submitting product:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (selectedProduct) {
      formik.setValues({
        name: selectedProduct.name,
        description: selectedProduct.description || "",
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      });
    } else {
      formik.resetForm();
    }
  }, [selectedProduct]);

  return (
    <div className='min-h-screen bg-gray-100 p-8 pt-24'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
          <button
            onClick={handleAddProduct}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Add Product
          </button>
        </div>
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            formik.resetForm();
            setIsModalOpen(false);
          }}
          formik={formik}
          isEditing={!!selectedProduct}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          productName={selectedProduct?.name || ""}
        />
      </div>
    </div>
  );
}
