import React, { createContext, useContext, useEffect, useState } from "react"
import { deleteTodoAPI, syncDataTodoAPI } from "~/apis/todo.api"
import { Todo } from "~/types/interface"
import { useNetworkStatus } from "./useNetworkStatus"

interface LocalDatabaseContextType {
  addTodo: (title: string) => void
  updateTodo: (id: number, status: string) => void
  deleteTodo: (id: number, synced: boolean) => void
  syncWithBackend: () => void
  todos: Todo[]
  error: string | null
}

const LocalDatabaseContext = createContext<
  LocalDatabaseContextType | undefined
>(undefined)

export const useLocalDatabase = () => {
  const context = useContext(LocalDatabaseContext)
  if (!context) {
    throw new Error(
      "useLocalDatabase must be used within a LocalDatabaseProvider"
    )
  }
  return context
}

export const LocalDatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [localDb, setLocalDb] = useState<Worker | null>(null)
  const [data, setData] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)
  const isOnline = useNetworkStatus()

  useEffect(() => {
    const worker = new Worker(
      new URL("/app/routes/track-three/local-db.ts", import.meta.url),
      {
        type: "module"
      }
    )

    worker.onmessage = (event) => {
      const { type, success, result, error } = event.data
      if (type === "init") {
        if (success) {
          setLocalDb(worker)
          loadTodos(worker)
        } else {
          setError(error)
        }
      } else if (type === "query") {
        if (success) {
          setData(result)
        } else {
          setError(error)
        }
      } else {
        setError(error)
      }
    }

    worker.postMessage({ type: "init" })
    return () => {
      if (localDb) {
        localDb.terminate()
      }
    }
  }, [])

  const loadTodos = (worker: Worker) => {
    worker.postMessage({
      type: "query",
      sql: "SELECT * FROM todos",
      params: []
    })
  }

  const listenMessage = async () => {
    if (!localDb) return
    await new Promise<void>((resolve, reject) => {
      localDb!.onmessage = (event) => {
        const { type, success, error, result } = event.data
        if (type === "query") {
          if (success) {
            setData(result)
            resolve()
          } else reject(new Error(error))
        }
      }
    })
  }

  const executeSql = (sql: string, params?: any) => {
    if (localDb) {
      localDb.postMessage({ type: "exec", sql, params })
    }
  }

  const addTodo = async (title: string) => {
    if (!localDb) return

    executeSql("INSERT INTO todos (title, status, synced) VALUES (?, ?, ?)", [
      title,
      "backlog",
      0
    ])

    loadTodos(localDb)
    await listenMessage()
  }

  const updateTodo = (id: number, status: string) => {
    executeSql("UPDATE todos SET status = ? WHERE id = ?", [status, id])
    loadTodos(localDb!)
  }

  const deleteTodo = async (id: number, synced: boolean) => {
    if (!localDb) return
    if (isOnline && synced) {
      const { data } = await deleteTodoAPI(id)
      if (data.status !== 200) setError("Failed to delete todo")
    }

    executeSql("DELETE FROM todos WHERE id = ?", [id])
    loadTodos(localDb)
    await listenMessage()
  }

  const syncWithBackend = async () => {
    if (!localDb) return
    try {
      const unsyncedTodos: Todo[] = []
      localDb!.postMessage({
        type: "query",
        sql: "SELECT id, title, status FROM todos WHERE synced = 0"
      })

      const fetchUnsyncedTodos = new Promise<void>((resolve) => {
        localDb!.onmessage = (event) => {
          const { type, result } = event.data

          if (type === "query") {
            result.forEach((row: any) => {
              unsyncedTodos.push(row as Todo)
            })
            resolve()
          }
        }
      })

      await fetchUnsyncedTodos
      if (unsyncedTodos.length === 0) return

      const { data } = await syncDataTodoAPI(unsyncedTodos)
      if (data.status !== 200) setError("Sync failed")

      const serverTodos = data.data.todos
      const transactionQueries = [
        { sql: "UPDATE todos SET synced = 1" },
        ...serverTodos.map((todo: Todo) => ({
          sql: `
          INSERT INTO todos (id, title, status, synced)
          VALUES (?, ?, ?, 1)
          ON CONFLICT(id)
          DO UPDATE SET title = excluded.title, status = excluded.status, synced = 1
        `,
          params: [todo.id, todo.title, todo.status]
        }))
      ]

      localDb.postMessage({ type: "transaction", queries: transactionQueries })
      await new Promise<void>((resolve, reject) => {
        localDb!.onmessage = (event) => {
          const { type, success, error } = event.data
          if (type === "transaction") {
            if (success) resolve()
            else reject(new Error(error))
          }
        }
      })

      loadTodos(localDb)
      await listenMessage()
    } catch (err: any) {
      setError("Failed to sync with backend: " + err.message)
      console.error(err)
    }
  }

  return (
    <LocalDatabaseContext.Provider
      value={{
        addTodo,
        updateTodo,
        deleteTodo,
        syncWithBackend,
        todos: data,
        error
      }}
    >
      {children}
    </LocalDatabaseContext.Provider>
  )
}
