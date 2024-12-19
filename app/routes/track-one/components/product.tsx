import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Loading from "~/components/loading"
import Table from "~/components/table"
import { useDeleteProduct } from "~/hooks/products/useDeleteProduct.hook"
import { useGetProducts } from "~/hooks/products/useGetProducts.hook"
import useDebounce from "~/hooks/useDebounce"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "~/components/ui/sheet"
import { CreateProductForm } from "./create-product-form"
import { EditProductForm } from "./edit-product-form"
import { useInsertProduct } from "~/hooks/products/useCreateProduct.hook"
import { InsertProduct } from "~/utils/schema"
import { toast } from "react-toastify"
import { Product } from "~/types/products.types"
import { useEditProduct } from "~/hooks/products/useEditProduct.hook"
import { ActionSheet } from "~/types/interface"

const columnsTitle = [
  "name",
  "description",
  "image",
  "price",
  "stock",
  "category",
  "brand"
]
const textConfirm = "Are you sure you want to delete this product?"

const Products = () => {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const { mutate: deleteProduct } = useDeleteProduct()
  const { mutate: insertProduct } = useInsertProduct()
  const { mutate: editProduct } = useEditProduct()
  const [page, setPage] = useState(params.page ? parseInt(params.page) : 1)
  const [limit, setLimit] = useState(parseInt(params.limit) || 10)
  const [search, setSearch] = useState(params.search || "")
  const [productEdit, setProductEdit] = useState<Product | null>(null)
  const debouncedInputValue = useDebounce(search, 300)
  const [actionSheet, setActionSheet] = useState<ActionSheet>(
    ActionSheet.DEFAULT
  ) // 0: default 1: add, 2: edit
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const navigate = useNavigate()
  const { data, isLoading } = useGetProducts(page, limit, debouncedInputValue)

  const handleDelete = (ids: number[]) => {
    deleteProduct(ids)
  }

  const handleEdit = (data: Product) => {
    editProduct(data)
    setActionSheet(0)
    toast.success("Product has been updated successfully")
  }

  const handleInsert = (data: InsertProduct) => {
    insertProduct(data)
    setActionSheet(0)
    toast.success("Product has been added successfully")
  }

  const handleSearch = (searchValue: string) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (searchValue.length === 0) {
      updatedParams.delete("search")
    } else {
      updatedParams.set("search", searchValue)
    }
    setPage(1)
    setSearch(searchValue)
    navigate(`?${updatedParams.toString()}`)
  }

  const handleChangePage = (pageNumber: number) => {
    const updatedParams = new URLSearchParams(searchParams)
    if (pageNumber === 1) {
      updatedParams.delete("page")
    } else {
      updatedParams.set("page", pageNumber.toString())
    }
    setPage(pageNumber)
    navigate(`?${updatedParams.toString()}`)
  }

  const handleChangeLimit = (limit: number) => {
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set("limit", limit.toString())
    setLimit(limit)
    navigate(`?${updatedParams.toString()}`)
  }

  const handleSelectItem = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSelectAllItem = () => {
    if (selectedIds.length === data?.data.items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(data?.data.items.map((item) => item.id) || [])
    }
  }

  useEffect(() => {
    setSelectedIds([])
  }, [data])

  if (isLoading) return <Loading />

  return (
    <div className="w-full p-4">
      <Table
        columnsTitle={columnsTitle}
        textConfirm={textConfirm}
        totalPages={data?.data.totalPages || 1}
        totalItem={data?.data.total || 0}
        page={page}
        dataRow={data?.data.items || []}
        searchValue={search}
        limit={limit}
        selectedIds={selectedIds}
        onChangeLimit={handleChangeLimit}
        onSelectedItem={handleSelectItem}
        onSelectAllItem={handleSelectAllItem}
        onActionSheet={setActionSheet}
        onDelete={handleDelete}
        onUpdate={(data) => setProductEdit(data as Product)}
        onChangePage={handleChangePage}
        onSearch={handleSearch}
      />

      {!!actionSheet && (
        <Sheet
          open={!!actionSheet}
          onOpenChange={() => setActionSheet(ActionSheet.DEFAULT)}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {actionSheet === ActionSheet.INSERT
                  ? "Insert New Product"
                  : "Edit Product"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {actionSheet === ActionSheet.INSERT && (
                <CreateProductForm onInsert={handleInsert} />
              )}
              {actionSheet === ActionSheet.EDIT && (
                <EditProductForm onEdit={handleEdit} product={productEdit!} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default Products
