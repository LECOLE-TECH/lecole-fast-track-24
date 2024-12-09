import React, { useEffect, useRef, useCallback } from "react";
import { Button } from "~/components/ui/button";
import type { Product } from "~/type/product";

interface ProductListProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDelete: (id: number) => void;
	isInfiniteScroll: boolean;
	loadMore: () => void;
}

function ProductList({
	products,
	onEdit,
	onDelete,
	isInfiniteScroll,
	loadMore,
}: ProductListProps) {
	const observer = useRef<IntersectionObserver | null>(null);
	const lastProductRef = useCallback(
		(node: HTMLElement | null) => {
			if (!isInfiniteScroll) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isInfiniteScroll, loadMore],
	);

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
				<thead>
					<tr>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Description
						</th>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Price
						</th>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Stock
						</th>
						<th className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product, index) => {
						if (products.length === index + 1 && isInfiniteScroll) {
							return (
								<tr
									ref={lastProductRef}
									key={product.id}
									className="hover:bg-gray-100 dark:hover:bg-gray-600">
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.id}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.name}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.description}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										${product.price.toFixed(2)}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.stock}
									</td>
									<td className="py-4 px-6 text-center space-x-2">
										<Button
											variant="secondary"
											size="sm"
											onClick={() => onEdit(product)}
											className="bg-blue-500 hover:bg-blue-600 text-white">
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => onDelete(product.id)}
											className="bg-red-500 hover:bg-red-600 text-white">
											Delete
										</Button>
									</td>
								</tr>
							);
						} else {
							return (
								<tr
									key={product.id}
									className="hover:bg-gray-100 dark:hover:bg-gray-600">
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.id}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.name}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.description}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										${product.price.toFixed(2)}
									</td>
									<td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-200">
										{product.stock}
									</td>
									<td className="py-4 px-6 text-center space-x-2">
										<Button
											variant="secondary"
											size="sm"
											onClick={() => onEdit(product)}
											className="bg-blue-500 hover:bg-blue-600 text-white">
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => onDelete(product.id)}
											className="bg-red-500 hover:bg-red-600 text-white">
											Delete
										</Button>
									</td>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		</div>
	);
}

export default ProductList;
