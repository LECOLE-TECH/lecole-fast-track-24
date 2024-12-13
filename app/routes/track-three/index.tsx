import type { Route } from "../track-three/+types";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { syncTodos } from "~/apis/todosApi";
import type { Todo, TodoLocal } from "~/types/todos";
import { useTodoStoreLocal } from "~/hooks/useTodoStoreLocal";
import useDetectNetwork from "~/hooks/useDetectNetwork";
import TodoColumn from "~/components/todoColumns";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import socket from "~/utils/socket";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const columns: { id: Todo["status"]; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Three" }];
}

export default function TrackThree() {
  const [todos, setTodos] = useState<TodoLocal[]>([]);
  const [error, setError] = useState<string>("");
  const [localDb, setLocalDb] = useState<any>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const { isOnline } = useDetectNetwork();
  const setIsOnline = useTodoStoreLocal((state) => state.setIsOnline);

  useEffect(() => {
    setIsOnline(isOnline);
  }, [isOnline, setIsOnline]);

  useEffect(() => {
    socket.on("user-connect-server", (data) => {
      toast.success(data.message);
    });

    socket.on("user-disconnect-server", (data) => {
      toast.error(data.message);
    });
  }, []);

  // Initialize local SQLite database
  useEffect(() => {
    const initLocalDb = async () => {
      try {
        const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm"))
          .default;
        const sqlite3 = await sqlite3InitModule();
        const db = new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");

        // Create local todos table
        db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
            synced INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        setLocalDb(db);
        loadLocalData(db);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to initialize local database");
      }
    };

    if (typeof window !== "undefined") {
      initLocalDb();
    }

    return () => {
      if (localDb) {
        localDb.close();
      }
    };
  }, []);

  const loadLocalData = (db: any) => {
    const results: TodoLocal[] = [];
    db.exec({
      sql: "SELECT id, title, status, synced, created_at FROM todos ORDER BY created_at DESC",
      callback: (row: any) => {
        results.push({
          id: row[0],
          title: row[1],
          status: row[2],
          synced: Boolean(row[3]),
          created_at: row[4],
        });
      },
    });
    setTodos(results);
  };

  const addTodo = () => {
    if (!newTodoTitle.trim()) return;

    try {
      localDb.exec({
        sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
        bind: [newTodoTitle],
      });
      setNewTodoTitle("");
      loadLocalData(localDb);
    } catch (err: any) {
      setError("Failed to add todo");
    }
  };

  const updateTodoStatus = (todoId: number, newStatus: TodoLocal["status"]) => {
    try {
      localDb.exec({
        sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
        bind: [newStatus, todoId],
      });
      loadLocalData(localDb);
    } catch (err: any) {
      setError("Failed to update todo status");
    }
  };

  const syncWithBackend = async () => {
    try {
      // Get all unsynced todos
      const unsyncedTodos: Partial<TodoLocal>[] = [];
      localDb.exec({
        sql: "SELECT id, title, status FROM todos WHERE synced = 0",
        callback: (row: any) => {
          unsyncedTodos.push({
            id: row[0],
            title: row[1],
            status: row[2],
          } as const);
        },
      });

      // Get updated todos from backend
      const serverTodos = await syncTodos(unsyncedTodos as TodoLocal[]);

      // Update local database with server data
      localDb.exec("BEGIN TRANSACTION");

      // Mark all existing todos as synced
      localDb.exec("UPDATE todos SET synced = 1");

      // Update or insert server todos
      serverTodos.forEach((todo: Todo) => {
        // Check if todo exists
        let exists = false;
        localDb.exec({
          sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
          bind: [todo.id],
          callback: (row: any) => {
            exists = row[0] > 0;
          },
        });

        if (exists) {
          // Update existing todo
          localDb.exec({
            sql: "UPDATE todos SET title = ?, status = ?, synced = 1 WHERE id = ?",
            bind: [todo.title, todo.status, todo.id],
          });
        } else {
          // Insert new todo
          localDb.exec({
            sql: "INSERT INTO todos (id, title, status, synced) VALUES (?, ?, ?, 1)",
            bind: [todo.id, todo.title, todo.status],
          });
        }
      });

      localDb.exec("COMMIT");

      // Reload local data
      loadLocalData(localDb);
    } catch (err: any) {
      setError("Failed to sync with backend: " + err.message);
      console.error(err);
    }
  };

  // Auto-sync every 15 seconds
  useEffect(() => {
    if (!localDb) return;
    const interval = setInterval(syncWithBackend, 15000);
    return () => clearInterval(interval);
  }, [localDb]);

  const filterTodosByStatus = (status: TodoLocal["status"]) => {
    return todos.filter((todo) => todo.status === status);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className='flex flex-col p-8 gap-4 min-h-screen'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Todo App</h1>
            <div
              className={`px-2 py-1 rounded ${
                isOnline ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </div>
            <Button onClick={syncWithBackend}>Sync Now</Button>
          </div>

          {error && <div className='text-red-500 mb-4'>Error: {error}</div>}

          {/* Add todo input */}
          <div className='flex gap-2 mb-4'>
            <input
              type='text'
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className='flex-1 px-3 py-2 border rounded bg-white'
              placeholder='Add new todo...'
            />
            <Button onClick={addTodo}>Add Todo</Button>
          </div>

          {/* Todos Columns */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {columns.map((column) => (
              <TodoColumn
                key={column.id}
                id={column.id}
                title={column.title}
                todos={todos.filter((todo) => todo.status === column.id)}
                updateTodoStatus={updateTodoStatus}
              />
            ))}
          </div>
        </div>
      </DndProvider>
      <ToastContainer />
    </>
  );
}
