import React, { useState, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { useToast } from "~/hooks/use-toast"
import { useAuth } from "../utils/contexts/authContext"
import type { User } from "../utils/types"
import { apiGetUsers, apiUpdateSecret } from "../utils/api"
import { UpdateSecretButton } from "./updateSecretButton"
import { LoadingSpinner } from "./loadingSpinner"
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card"
import PaginationContainer from "./paginationContainer"
import type { Socket } from "socket.io-client"
import { useWebSocketContext } from "../utils/contexts/webSocketContext"

const UserList = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFetchingUser,setIsFetchingUser] = useState(false)
  const {socket,on} = useWebSocketContext()
  const { toast } = useToast()

  useEffect(()=>{
    if(socket){
      on("new-user-registered",()=>{
        fetchUsers(currentPage)
      })
      on("user-change-secret",({username,secretPhrase}:{username:string,secretPhrase:string})=>{
        fetchUsers(currentPage)
        toast({
          title:"User secret update",
          description:username+" secret has been changed to: "+secretPhrase
        })
      })
    }
  },[socket,on])

  const fetchUsers = useCallback(async (page: number) => {
    setIsFetchingUser(true)
    try {
      const data = await apiGetUsers(page, 10)
      setUsers(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load users',
        variant: "destructive",
      })
    }
    setIsFetchingUser(false)
  }, [toast,user])

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage, fetchUsers])

  const handleUpdateSecretPhrase = useCallback(async (username:string,newSecretPhrase:string) => {
    try {
        await apiUpdateSecret(username, newSecretPhrase)
        toast({
            title: "Secret Updated",
            description: "Secret has been successfully updated.",
        })
        fetchUsers(currentPage)
        return true
    } catch (error) {
      toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to update secret phrase',
          variant: "destructive",
      })
      return false
    }
  }, [ toast, fetchUsers, currentPage])


  const tableHeaders = useCallback((role:string|undefined) => (
    <TableRow>
      <TableHead>Username</TableHead>
      {role && <TableHead>Role</TableHead>}
      {role === 'admin' && <TableHead>Secret Phrase</TableHead>}
      {role === 'admin' && <TableHead>Actions</TableHead>}
    </TableRow>
  ), [])

  const tableRows = useCallback((users:User[]) => (
    users.map((u) => (
      <TableRow key={u.id}>
        <TableCell>{u.username}</TableCell>
        {user?.roles && <TableCell>{u.roles}</TableCell>}
        {user?.roles === 'admin' && <TableCell>{u.secretPhrase}</TableCell>}
        {user?.roles === 'admin' && (
          <TableCell>
            <UpdateSecretButton username={u.username} currentSecretPhrase={u.secretPhrase} onSubmit={handleUpdateSecretPhrase}></UpdateSecretButton>
          </TableCell>
        )}
      </TableRow>
    ))
  ), [user,handleUpdateSecretPhrase])

  return (
    <Card className="container mx-auto mt-8 p-4">
      <CardTitle className="text-2xl font-bold mb-4">User List</CardTitle>
      <CardContent>
        {isFetchingUser?
        <LoadingSpinner></LoadingSpinner>:
        <Table className="w-full">
            <TableHeader>
                {tableHeaders(user?.roles)}
            </TableHeader>
            <TableBody>
                {tableRows(users)}
            </TableBody>
        </Table>}
      </CardContent>
      <CardFooter>
        <div className="w-full">
            <PaginationContainer onClick={(i)=>setCurrentPage(i)} totalPages={totalPages} currPage={currentPage}></PaginationContainer>
        </div>
      </CardFooter>
    </Card>
  )
}

export default React.memo(UserList)

