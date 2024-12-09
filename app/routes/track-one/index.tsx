import { useState, useCallback, lazy, Suspense, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { useProductStore } from "~/store/productStore";
import { useFetchProducts } from "~/hooks/useFetchProducts";
import type { Product } from "~/type/product";

// Lazy load ProductList and ProductForm
const ProductList = lazy(() => import("~/components/track-one/ProductList"));
const ProductForm = lazy(() => import("~/components/track-one/ProductForm"));

export default function TrackOne() {
	const { loading, error } = useFetchProducts();
	const products = useProductStore((state) => state.products);
	const addProduct = useProductStore((state) => state.addProduct);
	const updateProduct = useProductStore((state) => state.updateProduct);
	const deleteProduct = useProductStore((state) => state.deleteProduct);

	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const itemsPerPage = 10;

	// New States for Search and Sort
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortKey, setSortKey] = useState<"name" | "price">("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	// Memoize handlers with useCallback
	const handleCreate = useCallback(() => {
		setEditingProduct(null);
		setIsFormOpen(true);
	}, []);

	const handleEdit = useCallback((product: Product) => {
		setEditingProduct(product);
		setIsFormOpen(true);
	}, []);

	const handleDelete = useCallback(
		async (id: number) => {
			if (confirm("Are you sure you want to delete this product?")) {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/api/product/${id}`,
						{
							method: "DELETE",
						},
					);
					if (response.ok) {
						deleteProduct(id);
					} else {
						throw new Error("Failed to delete product");
					}
				} catch (err: any) {
					alert(err.message || "An error occurred");
				}
			}
		},
		[deleteProduct],
	);

	// Pagination logic
	const totalPages = Math.ceil(products.length / itemsPerPage);

	// Apply Search Filter
	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Apply Sorting
	const sortedProducts = filteredProducts.sort((a, b) => {
		let comparison = 0;
		if (sortKey === "name") {
			comparison = a.name.localeCompare(b.name);
		} else if (sortKey === "price") {
			comparison = a.price - b.price;
		} else if (sortKey === "id") {
			comparison = a.id - b.id;
		}
		return sortOrder === "asc" ? comparison : -comparison;
	});

	const paginatedProducts = sortedProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const handleNextPage = useCallback(() => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	}, [totalPages]);

	const handlePrevPage = useCallback(() => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	}, []);

	// Handlers for Search and Sort
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1); // Reset to first page on search
	};

	const handleSortKeyChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortKey(e.target.value as "name" | "price");
	};

	const handleSortOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(e.target.value as "asc" | "desc");
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
				Product Management
			</h1>
			<div className="flex justify-between mb-4">
				<Button
					onClick={handleCreate}
					className="bg-indigo-600 hover:bg-indigo-700 text-white">
					Add New Product
				</Button>
				{/* Search and Sort Controls */}
				<div className="flex space-x-4">
					<input
						type="text"
						placeholder="Search by name"
						value={searchTerm}
						onChange={handleSearchChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
					/>
					<select
						value={sortKey}
						onChange={handleSortKeyChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="name">Sort by Name</option>
						<option value="price">Sort by Price</option>
						<option value="id">Sort by ID</option>
					</select>
					<select
						value={sortOrder}
						onChange={handleSortOrderChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800">
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
				</div>
			</div>
			{loading && (
				<p className="text-center text-gray-600">Loading products...</p>
			)}
			{error && <p className="text-center text-red-500">{error}</p>}
			{!loading && !error && (
				<Suspense
					fallback={
						<p className="text-center text-gray-600">Loading product list...</p>
					}>
					<ProductList
						products={paginatedProducts}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
					{/* Pagination Controls */}
					<div className="flex justify-center items-center mt-4 space-x-4">
						<Button
							onClick={handlePrevPage}
							disabled={currentPage === 1}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:bg-gray-200">
							Previous
						</Button>
						<span className="text-gray-700 dark:text-gray-300">
							Page {currentPage} of{" "}
							{Math.max(Math.ceil(filteredProducts.length / itemsPerPage), 1)}
						</span>
						<Button
							onClick={handleNextPage}
							disabled={currentPage === totalPages || totalPages === 0}
							className="bg-gray-300 hover:bg-gray-400 text-gray-800 disabled:bg-gray-200">
							Next
						</Button>
					</div>
				</Suspense>
			)}
			{isFormOpen && (
				<Suspense fallback={<div>Loading form...</div>}>
					<ProductForm
						product={editingProduct}
						onClose={() => setIsFormOpen(false)}
						onSave={(product: Product) => {
							if (editingProduct) {
								updateProduct(product);
							} else {
								addProduct(product);
							}
							setIsFormOpen(false);
						}}
					/>
				</Suspense>
			)}
		</div>
	);
}
