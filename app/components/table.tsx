import { ChevronDown, Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import Image from "./Image"
import Pagination from "./pagination"
import { memo, useState } from "react"
import { toast } from "react-toastify"
import Modal from "./modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { ITEM_PER_PAGE } from "~/utils/constant"
import { ActionSheet } from "~/types/interface"

interface props<T> {
  page: number
  totalPages: number
  dataRow: T[]
  columnsTitle: string[]
  searchValue: string
  selectedIds: number[]
  textConfirm: string
  limit: number
  showCheckbox?: boolean
  showAction?: boolean
  totalItem: number
  id?: number
  onSelectedItem?: (id: number) => void
  onSelectAllItem?: () => void
  onActionSheet?: (value: number) => void
  onChangeLimit: (limit: number) => void
  onDelete?: (ids: number[]) => void
  onUpdate?: (data: T | null) => void
  onSearch: (data: string) => void
  onChangePage: (page: number) => void
}

const Table = <T,>({
  columnsTitle,
  dataRow,
  page = 1,
  limit = 10,
  totalItem = 0,
  totalPages = 10,
  showCheckbox = true,
  showAction = true,
  searchValue,
  selectedIds,
  textConfirm,
  onSelectedItem,
  onSelectAllItem,
  onActionSheet,
  onChangeLimit,
  onSearch,
  onDelete,
  onUpdate,
  onChangePage
}: props<T>) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const handleConfirmModal = () => {
    if (selectedIds.length === 0) {
      setShowModal(false)
      toast.error("Please select item to delete")
    } else {
      onDelete?.(selectedIds)
      setShowModal(false)
    }
  }

  const handleUpdate = (data: T) => {
    if (selectedIds.length === 0) {
      return toast.error("Please select item to edit")
    }
    if (selectedIds.length > 1) {
      return toast.error("Please select only one item to edit")
    }

    onUpdate?.(data as T)
    onActionSheet?.(ActionSheet.EDIT)
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] sm:rounded-lg">
        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white p-4">
          {showAction && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <span>Actions</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => onActionSheet?.(ActionSheet.INSERT)}
                      className="flex gap-4 hover:cursor-pointer"
                    >
                      <Plus />
                      <span>Insert</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (selectedIds.length === 0) {
                          toast.error("Please select item to delete")
                        } else {
                          setShowModal(true)
                        }
                      }}
                      className="flex gap-4 hover:cursor-pointer"
                    >
                      <Trash2 />
                      <span>Remove</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleUpdate(
                          dataRow.find(
                            (item) => item["id" as keyof T] === selectedIds[0]
                          ) as T
                        )
                      }}
                      className="flex gap-4 hover:cursor-pointer"
                    >
                      <Edit2 />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              value={searchValue}
              onChange={(e) => {
                onSearch(e.target.value)
              }}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              {showCheckbox && (
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <Checkbox onClick={() => onSelectAllItem?.()} />
                  </div>
                </th>
              )}
              {columnsTitle.map((title, index) => {
                if (
                  title === "description" ||
                  title === "image" ||
                  title === "avatar"
                ) {
                  return (
                    <th
                      key={index}
                      scope="col"
                      className="hidden xl:table-cell px-6 py-3"
                    >
                      {title}
                    </th>
                  )
                }
                return (
                  <th key={index} scope="col" className="px-6 py-3">
                    {title}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {dataRow.length > 0 &&
              dataRow?.map((row, index) => (
                <tr className="bg-white border-b" key={index}>
                  {showCheckbox && (
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <Checkbox
                          onClick={() =>
                            onSelectedItem?.(row["id" as keyof T] as number)
                          }
                          checked={selectedIds.includes(
                            row["id" as keyof T] as number
                          )}
                        />
                      </div>
                    </td>
                  )}

                  {columnsTitle.map((title, index) => {
                    if (title === "image" || title === "avatar") {
                      const url =
                        (row["image" as keyof T] as string) ||
                        (row["avatar" as keyof T] as string)
                      return (
                        <td
                          key={index}
                          className="hidden xl:table-cell px-6 py-4"
                        >
                          <Image
                            url={url}
                            className={`${
                              title === "avatar"
                                ? "w-20 h-20 rounded-full object-cover"
                                : "w-20 h-20 rounded-sm"
                            } `}
                            width={60}
                            height={60}
                            alt={
                              (row["name" as keyof T] as string) ||
                              (row["username" as keyof T] as string)
                            }
                          />
                        </td>
                      )
                    }

                    if (title === "description") {
                      return (
                        <td
                          key={index}
                          className="hidden xl:table-cell px-6 py-4"
                        >
                          {row["description" as keyof T] as string}
                        </td>
                      )
                    }

                    if (title === "price") {
                      return (
                        <td key={index} className="px-6 py-4">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                          }).format(row["price" as keyof T] as number)}
                        </td>
                      )
                    }
                    return (
                      <td key={index} className="px-6 py-4">
                        {(row[title as keyof T] as string) || "**************"}
                      </td>
                    )
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-6 items-center">
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 text-sm">Items per page</span>
          <div>
            <Select onValueChange={(value) => onChangeLimit(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent>
                {ITEM_PER_PAGE.map((num, index) => (
                  <SelectItem
                    key={index}
                    value={num}
                    className="cursor-pointer"
                  >
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-gray-500 text-sm">
            <span>
              {`${page * limit - limit + 1} - ${
                page * limit
              }  of ${totalItem} items`}
            </span>
          </span>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onChangePage}
        />
      </div>

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          textConfirm={textConfirm}
          onConfirm={handleConfirmModal}
        />
      )}
    </>
  )
}

// export default Table

// when the component is large and has a lot of data, it is better to use React.memo to avoid re-rendering the component
export default memo(Table, (prevProps, nextProps) => {
  if (!!nextProps.id) {
    return false
  }

  return (
    prevProps.dataRow.length === nextProps.dataRow.length &&
    prevProps.selectedIds.length === nextProps.selectedIds.length &&
    prevProps.limit === nextProps.limit &&
    prevProps.totalItem === nextProps.totalItem &&
    prevProps.page === nextProps.page &&
    prevProps.searchValue === nextProps.searchValue &&
    prevProps.totalPages === nextProps.totalPages
  )
})
