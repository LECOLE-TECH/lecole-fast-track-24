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
import { useState } from "react"
import { toast } from "react-toastify"
import Modal from "./modal"

interface props<T> {
  page: number
  totalPages: number
  title: string
  dataRow: T[]
  columnsTitle: string[]
  searchValue: string
  textConfirm: string
  onActionSheet: (value: number) => void
  onDelete: (ids: number[]) => void
  onSearch: (data: string) => void
  onChangePage: (page: number) => void
}

const Table = <T,>({
  columnsTitle,
  dataRow,
  title,
  page = 1,
  totalPages = 10,
  searchValue,
  textConfirm,
  onActionSheet,
  onSearch,
  onDelete,
  onChangePage
}: props<T>) => {
  const [ids, setIds] = useState<number[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleIds = (id: number) => {
    if (ids.includes(id)) {
      setIds(ids.filter((item) => item !== id))
    } else {
      setIds([...ids, id])
    }
  }

  const handlePushhAllIds = () => {
    if (ids.length === dataRow.length) {
      setIds([])
    } else {
      setIds(dataRow.map((item) => item["id" as keyof T] as number))
    }
  }

  const handleConfirmModal = () => {
    if (ids.length === 0) {
      setShowModal(false)
      toast.error("Please select item to delete")
    } else {
      onDelete(ids)
      setShowModal(false)
    }
  }

  return (
    <>
      <div>
        <h2 className="font-medium mb-4">{title}</h2>
      </div>
      <div className="relative overflow-x-auto shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] sm:rounded-lg">
        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white p-4">
          <div className="flex-1">
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
                    onClick={() => onActionSheet(1)}
                    className="flex gap-4 hover:cursor-pointer"
                  >
                    <Plus />
                    <span>Insert</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (ids.length === 0) {
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
                    onClick={() => onActionSheet(2)}
                    className="flex gap-4 hover:cursor-pointer"
                  >
                    <Edit2 />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative flex-1">
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
              placeholder="Search ..."
            />
          </div>

          <div className="hidden flex-1 lg:flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onChangePage}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <Checkbox onClick={() => handlePushhAllIds()} />
                </div>
              </th>
              {columnsTitle.map((title, index) => {
                if (title === "description") {
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
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <Checkbox
                        onClick={() =>
                          handleIds(row["id" as keyof T] as number)
                        }
                        checked={ids.includes(row["id" as keyof T] as number)}
                      />
                    </div>
                  </td>

                  {columnsTitle.map((title, index) => {
                    if (title === "image") {
                      return (
                        <td key={index} className="px-6 py-4">
                          <Image
                            url={row["image" as keyof T] as string}
                            className="w-20 h-20 rounded-sm"
                            width={60}
                            height={60}
                            alt={row["name" as keyof T] as string}
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
                        {row[title as keyof T] as string}
                      </td>
                    )
                  })}
                </tr>
              ))}
          </tbody>
        </table>
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

export default Table
