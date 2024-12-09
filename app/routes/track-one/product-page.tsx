import { useState, useEffect } from "react";
import { ArraySkeleton, TableRowSkeleton } from "~/components/common/skeleton";
import { ProductTable } from "~/components/product/product-table";
import { getProduct } from "~/lib/api";
import type { Product } from "~/lib/model";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getProduct().then((data) => setProducts(data));
  }, []);

  if (!products) {
    return (
      <>
        <TableRowSkeleton classname="w-1/4" />
        <TableRowSkeleton classname="w-1/2" />
        <ArraySkeleton num={5} component={<TableRowSkeleton />} />
      </>
    );
  }

  return <ProductTable products={products} />;
}
