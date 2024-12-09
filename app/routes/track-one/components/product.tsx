import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Loading from "~/components/loading"
import Table from "~/components/table"
import { useGetProducts } from "~/hooks/products/useGetProducts.hook"
import useDebounce from "~/hooks/useDebounce"

const Products = () => {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const [page, setPage] = useState(params.page ? parseInt(params.page) : 1)
  const [search, setSearch] = useState(params.search || "")
  const debouncedInputValue = useDebounce(search, 300)
  const navigate = useNavigate()
  const { data, isLoading } = useGetProducts(page, debouncedInputValue)
  const handleDelete = (ids: number[]) => {}
  const handleEdit = () => {}
  const handleAdd = () => {}

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

  if (isLoading) return <Loading />

  return (
    <div className="w-full p-4">
      <Table
        columnsTitle={[
          "name",
          "description",
          "image",
          "price",
          "stock",
          "category",
          "brand"
        ]}
        totalPages={data?.data.totalPages || 1}
        page={page}
        dataRow={data?.data.items || []}
        title="List Product"
        searchValue={search}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onUpdate={handleEdit}
        onChangePage={handleChangePage}
        onSearch={handleSearch}
      />
    </div>
  )
}

export default Products
