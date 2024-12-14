import type { Route } from "../track-three/+types";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import type { Todo, TodoLocal } from "~/types/todos";
import TodoColumn from "~/components/todoColumns";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import socket from "~/utils/socket";
import { useTodoStoreLocal } from "~/hooks/useTodoStoreLocal";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const columns: { id: Todo["status"]; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Three" }];
}

export default function TrackThree() {
  const [error, setError] = useState<string>("");
  const [localDb, setLocalDb] = useState<any>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const {
    todos,
    db,
    setIsOnline,
    initialDatabase,
    fetchTodos,
    addTodo,
    updateTodoStatus,
    syncWithBackend,
  } = useTodoStoreLocal();

  useEffect(() => {
    socket.on("user-connect-server", (data) => {
      toast.success(data.message);
      setIsSocketConnected(true);
      setIsOnline(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
      setIsOnline(false);
    });

    if (!isSocketConnected) {
      toast.warning("Disconnected Server");
    }

    return () => {
      socket.off("user-connect-server");
    };
  }, [isSocketConnected]);

  // Initialize local SQLite database
  useEffect(() => {
    if (typeof window !== "undefined") {
      initialDatabase();
    }
    setLocalDb(db);
    fetchTodos();

    return () => {
      if (localDb) {
        localDb.close();
      }
    };
  }, []);

  // Auto-sync every 15 seconds
  useEffect(() => {
    if (!localDb) return;
    const interval = setInterval(syncWithBackend, 15000);
    return () => clearInterval(interval);
  }, [localDb]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className='flex flex-col p-8 gap-4 min-h-screen'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Todo App</h1>
            <div
              className={`px-2 py-1 rounded ${
                isSocketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isSocketConnected ? "Online" : "Offline"}
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
            <Button onClick={() => addTodo(newTodoTitle)}>Add Todo</Button>
          </div>

          {/* Todos Columns */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {columns.map((column) => (
              <TodoColumn
                key={column.id}
                id={column.id} // backlog | in_progres | done
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
