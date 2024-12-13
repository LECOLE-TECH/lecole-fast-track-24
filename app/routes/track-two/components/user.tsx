import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Loading from "~/components/loading"
import Table from "~/components/table"
import useDebounce from "~/hooks/useDebounce"
import { RegisterUser, SecretUser } from "~/utils/schema"
import { toast } from "react-toastify"
import { ActionSheet } from "~/types/interface"
import { useGetUsers } from "~/hooks/users/useGetUsers.hook"
import { useStore } from "~/store"
import { useSocket } from "~/hooks/useSocket"
import { decryptMessage, encryptMessage } from "~/utils/cryptography"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "~/components/ui/sheet"
import { RegisterForm } from "./register-form"
import { SecretForm } from "./secret-form"
import { User } from "~/types/users.types"
import { useQueryClient } from "@tanstack/react-query"

const columnsTitle = ["avatar", "username", "role", "secret"]
const textConfirm = "Are you sure you want to delete this user?"

const Users = () => {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const { socket } = useSocket()
  const [page, setPage] = useState(params.page ? parseInt(params.page) : 1)
  const [limit, setLimit] = useState(parseInt(params.limit) || 10)
  const [search, setSearch] = useState(params.search || "")
  const [userEdit, setUserEdit] = useState<User | null>(null)
  const debouncedInputValue = useDebounce(search, 300)
  const [actionSheet, setActionSheet] = useState<ActionSheet>(
    ActionSheet.DEFAULT
  )
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data, isLoading } = useGetUsers(page, limit, debouncedInputValue)
  const user = useStore((state) => state.user)

  const handleInsert = (user: RegisterUser) => {
    if (socket) {
      const encryptedData = encryptMessage(user)
      socket.emit("create-user", encryptedData)
      toast.success("User has been created successfully")
      setActionSheet(ActionSheet.DEFAULT)
    }
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

  const handleDelete = (ids: number[]) => {
    const payload = {
      ids
    }
    if (socket) {
      const encryptedData = encryptMessage(payload)
      socket.emit("delete-user", encryptedData)
      toast.success("User has been deleted successfully")
      setActionSheet(ActionSheet.DEFAULT)
      data!.data.items = data!.data.items.filter((i) => !ids.includes(i.id))
      queryClient.invalidateQueries({
        queryKey: ["users", { page, limit, search }]
      })
    }
  }

  const handleUpdateUser = ({ secret }: SecretUser) => {
    const payload = {
      id: userEdit?.id!,
      secret
    }
    if (socket) {
      const encryptedData = encryptMessage(payload)
      socket.emit("update-user", encryptedData)
      toast.success("Secret has been updated successfully")
      setActionSheet(ActionSheet.DEFAULT)

      data!.data.items.map((item) => {
        if (item.id === userEdit?.id) {
          item.secret = secret
        }
        return item
      })
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("update-user-response", (_: string) => {
        setSelectedIds([])
      })

      socket.on("create-user-response", (response: string) => {
        const decryptedData = decryptMessage(response) as User
        data!.data.items.unshift(decryptedData)
        setSelectedIds([])
      })

      socket.on("delete-user-response", (_: string) => {
        setSelectedIds([])
      })
    }

    return () => {
      socket?.off("update-user-response")
    }
  }, [socket])

  useEffect(() => {
    setSelectedIds([])
  }, [data])

  if (isLoading)
    return (
      <div className="w-full my-10">
        <Loading />
      </div>
    )

  return (
    <div className="w-full my-10 px-4">
      <Table
        id={user?.id}
        columnsTitle={columnsTitle}
        textConfirm={textConfirm}
        totalPages={data?.data.totalPages || 1}
        totalItem={data?.data.total || 0}
        page={page}
        dataRow={data?.data.items || []}
        searchValue={search}
        limit={limit}
        showCheckbox={user?.role == "admin" ? true : false}
        showAction={user?.role == "admin" ? true : false}
        selectedIds={selectedIds}
        onChangeLimit={handleChangeLimit}
        onSelectedItem={handleSelectItem}
        onSelectAllItem={handleSelectAllItem}
        onActionSheet={setActionSheet}
        onUpdate={(data) => setUserEdit(data as User)}
        onChangePage={handleChangePage}
        onDelete={handleDelete}
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
                  ? "Insert New User"
                  : "Change Secret User"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {actionSheet === ActionSheet.INSERT && (
                <RegisterForm onRegister={handleInsert} />
              )}
              {actionSheet === ActionSheet.EDIT && (
                <SecretForm
                  onChangeSecret={handleUpdateUser}
                  currentSecret={userEdit?.secret!}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default Users
