import { create } from "zustand";
import type { Product } from "~/type/product";

interface ProductState {
	products: Product[];
	setProducts: (products: Product[]) => void;
	addProduct: (product: Product) => void;
	updateProduct: (updatedProduct: Product) => void;
	deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
	products: [],
	setProducts: (products) => set({ products }),
	addProduct: (product) =>
		set((state) => ({ products: [...state.products, product] })),
	updateProduct: (updatedProduct) =>
		set((state) => ({
			products: state.products.map((product) =>
				product.id === updatedProduct.id ? updatedProduct : product,
			),
		})),
	deleteProduct: (id) =>
		set((state) => ({
			products: state.products.filter((product) => product.id !== id),
		})),
}));
