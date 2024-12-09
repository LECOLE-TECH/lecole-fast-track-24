import type { Route } from "../track-one/+types";

import * as React from "react"
import { getProduct } from "@/routes/apiForProducts/getProduct"
import { deleteProduct } from "@/routes/apiForProducts/getProduct"
import { updateProduct } from "@/routes/apiForProducts/getProduct"
import { UpdateProductDrawer } from "@/components/update-product-drawer"
export function meta({}: Route.MetaArgs) {
  return [{ title: "Track One" }];
}
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { AddProductDrawer } from "@/components/add-product-drawer"
import {useEffect} from "react";

interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
}

export default function TrackOne() {
    const [data, setData] = React.useState<Product[]>([])
    const [filters, setFilters] = React.useState({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
    })
    const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false)
    const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = React.useState(false)
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

    useEffect(() => {
        const fetchData = async () => {
         const data = await getProduct()
           setData(data)
        }
        fetchData()
    }, []);

    const handleFilterChange = (column: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [column]: value,
        }))
    }

    const filteredData = data.filter((item) => {
        return (
            item.id.toString().includes(filters.id) &&
            item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            item.description.toLowerCase().includes(filters.description.toLowerCase()) &&
            item.price.toString().includes(filters.price) &&
            item.stock.toString().includes(filters.stock)
        )
    })


    const handleUpdateClick = (product: Product) => {
        setSelectedProduct(product)
        setIsUpdateDrawerOpen(true)
    }

const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
        // Update product in API
        const res = await updateProduct(updatedProduct.id, updatedProduct);
        setData((prev) => prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
        console.log("Product updated:", res);
    } catch (error) {
        console.error("Error updating product:", error);
    }
};
    const handleDelete = async (id: number) => {

        try {
            // Delete product from API
            const res = await deleteProduct(id)
            setData((prev) => prev.filter((item) => item.id !== id))
            console.log("Product deleted:", res)
        }catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    const handleAddProduct = (newProduct: Omit<Product, "id">) => {
        const newId = Math.max(...data.map(p => p.id)) + 1
        setData((prev) => [...prev, { ...newProduct, id: newId }])
    }

    return (
      <div className="p-4">
          <div className="mb-4 flex justify-end">
              <Button className="flex items-center gap-2" onClick={() => setIsAddDrawerOpen(true)}>
                  <PlusCircle className="h-4 w-4"/>
                  Add Product
              </Button>
          </div>
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead>
                          <Input
                              placeholder="Filter ID"
                              value={filters.id}
                              onChange={(e) => handleFilterChange("id", e.target.value)}
                              className="max-w-[100px]"
                          />
                      </TableHead>
                      <TableHead>
                          <Input
                              placeholder="Filter Name"
                              value={filters.name}
                              onChange={(e) => handleFilterChange("name", e.target.value)}
                          />
                      </TableHead>
                      <TableHead>
                          <Input
                              placeholder="Filter Description"
                              value={filters.description}
                              onChange={(e) => handleFilterChange("description", e.target.value)}
                          />
                      </TableHead>
                      <TableHead>
                          <Input
                              placeholder="Filter Price"
                              value={filters.price}
                              onChange={(e) => handleFilterChange("price", e.target.value)}
                              className="max-w-[100px]"
                          />
                      </TableHead>
                      <TableHead>
                          <Input
                              placeholder="Filter Stock"
                              value={filters.stock}
                              onChange={(e) => handleFilterChange("stock", e.target.value)}
                              className="max-w-[100px]"
                          />
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredData.map((product) => (
                      <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                              <div className="flex gap-2">
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleUpdateClick(product)}
                                  >
                                      <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(product.id)}
                                  >
                                      <Trash2 className="h-4 w-4"/>
                                  </Button>
                              </div>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
          <AddProductDrawer
              isOpen={isAddDrawerOpen}
              onClose={() => setIsAddDrawerOpen(false)}
              onSubmit={handleAddProduct}
          />
          <UpdateProductDrawer
              isOpen={isUpdateDrawerOpen}
              onClose={() => setIsUpdateDrawerOpen(false)}
              onUpdate={handleUpdateProduct}
              product={selectedProduct}
          />
      </div>
  );
}
