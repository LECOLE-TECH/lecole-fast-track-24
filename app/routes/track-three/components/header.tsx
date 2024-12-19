import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useLocalDatabase } from "~/hooks/useLocalDatabase"
import { useNetworkStatus } from "~/hooks/useNetworkStatus"

const TodoHeader = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const { addTodo, syncWithBackend, todos, error } = useLocalDatabase()
  const isOnline = useNetworkStatus()

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <Button
          className="w-[100px]"
          disabled={!todos || todos.length === 0 || !isOnline}
          onClick={() => {
            syncWithBackend()
          }}
        >
          Sync Now
        </Button>
      </div>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="flex-1 px-3 py-2 border rounded bg-transparent"
          placeholder="Add new todo..."
        />
        <Button
          className="w-[100px]"
          onClick={() => {
            if (!newTodoTitle) return toast.error("Please enter a title")
            addTodo(newTodoTitle)
            setNewTodoTitle("")
          }}
          disabled={!todos || todos.length === 0}
        >
          Add Todo
        </Button>
      </div>
    </>
  )
}

export default TodoHeader
