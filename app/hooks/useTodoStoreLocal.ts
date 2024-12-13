import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo, TodoLocal } from "~/types/todos";
import useDetectNetwork from "./useDetectNetwork";
import { localDatabase } from "~/services/localDatabase";

interface TodoStoreLocal {
  todos: TodoLocal[];
  syncStatus: boolean;
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  updateTodoStatus: (
    todoId: number,
    newStatus: Todo["status"]
  ) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

export const useTodoStoreLocal = create<TodoStoreLocal>()(
  persist(
    (set, get) => ({
      todos: [],
      syncStatus: false,
      isOnline: useDetectNetwork().isOnline,

      setIsOnline: (status) => {
        set({ isOnline: status });
        if (status) {
          get().syncWithBackend();
        }
      },

      fetchTodos: async () => {
        try {
          const todos = await localDatabase.loadLocalData();
          set({ todos });
        } catch (error) {
          console.error("Failed to fetch todos:", error);
        }
      },

      addTodo: async (title) => {
        try {
          const todos = await localDatabase.addTodo(title);
          set({ todos });
          if (get().isOnline) {
            get().syncWithBackend();
          }
        } catch (error) {
          console.error("Failed to add todo:", error);
        }
      },

      updateTodoStatus: async (
        todoId: number,
        newTodoStatus: Todo["status"]
      ) => {
        try {
          const todos = await localDatabase.updateTodoStatus(
            todoId,
            newTodoStatus
          );
          set({ todos });
          if (get().isOnline) {
            get().syncWithBackend();
          }
        } catch (error) {
          console.error("Failed to update todo:", error);
        }
      },

      deleteTodo: async (id) => {
        try {
          const todos = await localDatabase.deleteTodo(id);
          set({ todos });
          if (get().isOnline) {
            get().syncWithBackend();
          }
        } catch (error) {
          console.error("Failed to delete todo:", error);
        }
      },

      syncWithBackend: async () => {
        const { isOnline } = get();
        if (!isOnline) return;

        set({ syncStatus: false });

        try {
          const todos = await localDatabase.syncWithBackend();
          set({ todos, syncStatus: true });
        } catch (error) {
          console.error("Sync failed:", error);
          set({ syncStatus: false });
        }
      },
    }),
    {
      name: "todo-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
