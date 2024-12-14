import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { Route } from "../track-three/+types";
import { Button } from "~/components/ui/button";
import { TodoBoard } from "~/components/TodoBoard";
import { localDbService } from "~/services/localDb";
import { AddTodoDialog } from "~/components/AddTodoDialog";
import { setTodos, setError } from '~/store/todoSlice';
import type { RootState } from '~/store/store';

export function meta({}: Route.MetaArgs) {
  return [{ title: "Track Three" }];
}

export default function TrackThree() {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const error = useSelector((state: RootState) => state.todos.error);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        await localDbService.initialize();
        await syncWithBackend();
        loadTodos();
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to initialize local database"));
      }
    };

    if (typeof window !== "undefined") {
      initDb();
    }

    return () => {
      localDbService.close();
    };
  }, [dispatch]);

  const loadTodos = () => {
    dispatch(setTodos(localDbService.getTodos()));
  };

  const syncWithBackend = async () => {
    try {
      const unsyncedTodos = localDbService.getUnsyncedTodos();
      const response = await fetch("http://localhost:3000/api/todos/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos: unsyncedTodos })
      });

      if (!response.ok) throw new Error("Sync failed");
      const serverTodos = await response.json();

      const sortedServerTodos = [...serverTodos].sort((a, b) => a.order_index - b.order_index);

      localDbService.syncTodos(sortedServerTodos);
      loadTodos();
    } catch (err: any) {
      dispatch(setError("Failed to sync with backend: " + err.message));
    }
  };

  useEffect(() => {
    const interval = setInterval(syncWithBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col p-8 gap-4 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <Button onClick={syncWithBackend}>Sync Now</Button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <Button onClick={() => setShowAddDialog(true)}>Add New Todo</Button>

      {showAddDialog && (
        <AddTodoDialog
          onAdd={(title) => {
            localDbService.addTodo(title);
            loadTodos();
            setShowAddDialog(false);
          }}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      <TodoBoard todos={todos} />
    </div>
  );
}