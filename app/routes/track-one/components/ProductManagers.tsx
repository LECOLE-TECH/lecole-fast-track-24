import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { createProduct, updateProduct, deleteProduct, fetchProducts } from "~/lib/api"
import type { EditingProduct, Product } from "~/lib/types"
import ProductList from "./ProductList"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import LoadingSpinner from "./LoadingSpinner"
import ProductForm from "./ProductForm"
import PaginationContainer from "./PaginationContainer"
import { useAlertContext } from "../context/AlertContext"


const ProductManager = ()=>{
    const [products, setProducts] = useState<Product[]>([])
    const [isFetchingData,setIsFetchingData] = useState(false)
    const [page,setPage] = useState(1)
    const [totalPage,setTotalPage] = useState(1)
    const {addAlert} = useAlertContext()

    const handleFetchProducts = useCallback(async (page: number) => {
        setIsFetchingData(true);
        try {
            const response = await fetchProducts({ page });
            setProducts(response.data);
            setTotalPage(response.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsFetchingData(false);
        }
    }, []);
    
    const handleCreateProduct = useCallback(async (product: EditingProduct) => {
        setIsFetchingData(true)
        try {
            await createProduct(product)
            await handleFetchProducts(page)
            addAlert("success","Product added successfully")
        } catch (error) {
            console.error('Failed to create product:', error)
            addAlert("error","Failed to add product")
        }
        setIsFetchingData(false)
    }, [])
    
    const handleUpdateProduct = useCallback(async (product: EditingProduct,productId:number) => {
        try {
            const updatedProduct = await updateProduct({...product,id:productId})
            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
            addAlert("success","Product updated successfully")
        } catch (error) {
            console.error('Failed to update product:', error)
            addAlert("error","Failed to update product")
        }
    }, [])
    
    const handleDeleteProduct = useCallback(async (id: number) => {
        try {
            await deleteProduct(id)
            handleFetchProducts(page)
            addAlert("success","Product deleted successfully")
        } catch (error) {
            console.error('Failed to delete product:', error)
            addAlert("success","Failed to delete")
        }
    }, [])
    
    const memoizedProductList = useMemo(() => (
        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
        />
    ), [products, handleDeleteProduct, handleUpdateProduct])

    useEffect(()=>{
        handleFetchProducts(page)
    },[page])
    
    return (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Product</CardTitle>

            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <ProductForm onSubmit={handleCreateProduct} />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>

            </CardHeader>
            <CardContent>
              {isFetchingData?
                <LoadingSpinner/>:
                <Suspense fallback={<LoadingSpinner />}>
                    {memoizedProductList}
                </Suspense>
              }
            </CardContent>
            <CardFooter>
                <PaginationContainer 
                    onClick={(i)=>setPage(i)}
                    totalPages={totalPage}
                    currPage={page}
                ></PaginationContainer>
            </CardFooter>
          </Card>
        </div>
    )
}

export default ProductManager