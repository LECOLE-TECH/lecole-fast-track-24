import { useState } from "react";
import type { Product } from "~/type/product";
import { Button } from "~/components/ui/button";

interface ProductFormProps {
	product: Product | null;
	onClose: () => void;
	onSave: (product: Product) => void;
}

function ProductForm({ product, onClose, onSave }: ProductFormProps) {
	const [name, setName] = useState<string>(product?.name || "");
	const [description, setDescription] = useState<string>(
		product?.description || "",
	);
	const [price, setPrice] = useState<number>(product?.price || 0);
	const [stock, setStock] = useState<number>(product?.stock || 0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const payload = { name, description, price, stock };

		try {
			let response;
			if (product) {
				// Update existing product
				response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/product/${product.id}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					},
				);
			} else {
				// Create new product
				response = await fetch(`${import.meta.env.VITE_API_URL}/api/product`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			}

			if (!response.ok) {
				throw new Error("Failed to save product");
			}

			const savedProduct: Product = await response.json();
			onSave(savedProduct);
		} catch (err: any) {
			setError(err.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
			<form
				onSubmit={handleSubmit}
				className="bg-white dark:bg-gray-700 p-6 rounded-lg w-96">
				<h2 className="text-xl font-semibold mb-4">
					{product ? "Edit Product" : "Add New Product"}
				</h2>
				{error && <p className="text-red-500 mb-2">{error}</p>}
				<div className="mb-4">
					<label className="block mb-1">Name</label>
					<input
						type="text"
						className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-1">Description</label>
					<textarea
						className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white"
						value={description}
						onChange={(e) => setDescription(e.target.value)}></textarea>
				</div>
				<div className="mb-4">
					<label className="block mb-1">Price</label>
					<input
						type="number"
						step="0.01"
						className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white"
						value={price}
						onChange={(e) => setPrice(parseFloat(e.target.value))}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-1">Stock</label>
					<input
						type="number"
						className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white"
						value={stock}
						onChange={(e) => setStock(parseInt(e.target.value))}
						required
					/>
				</div>
				<div className="flex justify-end">
					<Button
						type="button"
						onClick={onClose}
						className="mr-2">
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={loading}>
						{loading ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</div>
	);
}

export default ProductForm;
