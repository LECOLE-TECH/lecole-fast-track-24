import { useEffect, useState } from "react";
import { useProductStore } from "~/store/productStore";
import type { Product } from "~/type/product";

export function useFetchProducts() {
	const setProducts = useProductStore((state) => state.setProducts);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				// const response = await fetch("http://localhost:3000/api/product");
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/product`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch products");
				}
				const data: Product[] = await response.json();
				setProducts(data);
			} catch (err: any) {
				setError(err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [setProducts]);

	return { loading, error };
}
