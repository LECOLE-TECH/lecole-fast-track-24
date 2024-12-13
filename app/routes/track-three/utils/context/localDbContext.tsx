import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Todo } from "../types";
import { useToast } from "~/hooks/use-toast";
import { syncTodos } from "../api";

type LocalDbContextType = {
  todos: Todo[];
  backendConnection: boolean;
  addTodo: (title: string) => void;
  updateTodoStatus: (todoId: number, newStatus: Todo["status"]) => void;
  syncWithBackend: () => Promise<void>;
  deleteTodo: (todoId: number) => void;
};

const LocalDbContext = createContext<LocalDbContextType | undefined>(undefined);

export const LocalDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localDb, setLocalDb] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [backendConnection, setBackendConnection] = useState(false);
  const { toast } = useToast();

  const loadLocalData = useCallback((db: any) => {
    const results: Todo[] = [];
    db.exec({
      sql: "SELECT id, title, status, synced, created_at, isDeleted FROM todos ORDER BY created_at DESC",
      callback: (row: any) => {
        results.push({
          id: row[0],
          title: row[1],
          status: row[2],
          synced: Boolean(row[3]),
          created_at: row[4],
          isDeleted: Boolean(row[5]),
          isAdded: Boolean(row[6]),
        });
      },
    });
    setTodos(results);
  }, []);

  const addTodo = useCallback(
    (newTodoTitle: string) => {
      try {
        localDb.exec({
          sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
          bind: [newTodoTitle],
        });
        loadLocalData(localDb);
      } catch (err: any) {
        toast({
          title: "Failed to add todo",
          variant: "destructive",
        });
      }
    },
    [localDb, loadLocalData, toast]
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      try {
        localDb.exec({
          sql: "UPDATE todos SET isDeleted = 1, synced = 0 WHERE id = ?",
          bind: [todoId],
        });
        loadLocalData(localDb);
      } catch (err: any) {
        toast({
          title: "Failed to delete todo",
          variant: "destructive",
        });
      }
    },
    [localDb, loadLocalData, toast]
  );

  const updateTodoStatus = useCallback(
    (todoId: number, newStatus: Todo["status"]) => {
      try {
        localDb.exec({
          sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
          bind: [newStatus, todoId],
        });
        loadLocalData(localDb);
      } catch (err: any) {
        toast({
          title: "Failed to update todo",
          variant: "destructive",
        });
      }
    },
    [localDb, loadLocalData, toast]
  );

  const syncWithBackend = useCallback(async () => {
    try {
      const unsyncedTodos: Partial<Todo>[] = [];
      localDb.exec({
        sql: "SELECT id, title, status, isDeleted, isAdded FROM todos WHERE synced = 0",
        callback: (row: any) => {
          unsyncedTodos.push({
            id: row[0],
            title: row[1],
            status: row[2],
            isDeleted: row[3],
            isAdded: row[4],
          });
        },
      });

      const serverTodos = await syncTodos(unsyncedTodos);
      setBackendConnection(true);

      localDb.exec("BEGIN TRANSACTION");
      localDb.exec("UPDATE todos SET synced = 1");

      serverTodos.forEach((todo) => {
        let exists = false;
        localDb.exec({
          sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
          bind: [todo.id],
          callback: (row: any) => {
            exists = row[0] > 0;
          },
        });

        if (exists) {
          localDb.exec({
            sql: "UPDATE todos SET title = ?, status = ?, synced = 1, isAdded = 0 WHERE id = ?",
            bind: [todo.title, todo.status, todo.id],
          });
        } else {
          localDb.exec({
            sql: "INSERT INTO todos (id, title, status, synced, isAdded) VALUES (?, ?, ?, 1, 0)",
            bind: [todo.id, todo.title, todo.status],
          });
        }
      });

      localDb.exec({
        sql: "DELETE FROM todos WHERE isDeleted = 1",
      });

      localDb.exec("COMMIT");
      loadLocalData(localDb);
    } catch (err: any) {
      console.error(err);
      setBackendConnection(false);
    }
  }, [localDb, loadLocalData]);

  useEffect(() => {
    const initLocalDb = async () => {
      try {
        const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm")).default;
        const sqlite3 = await sqlite3InitModule();
        const db = new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");

        db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
            synced INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            isDeleted INTEGER DEFAULT 0,
            isAdded INTEGER DEFAULT 1
          )
        `);

        setLocalDb(db);
        loadLocalData(db);
      } catch (err: any) {
        console.error(err);
        toast({
          title: err.message || "Failed to initialize local database",
          variant: "destructive",
        });
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
  }, [loadLocalData, toast]);

  useEffect(() => {
    if (!localDb) return;
    syncWithBackend();
    const interval = setInterval(syncWithBackend, 15000);
    return () => clearInterval(interval);
  }, [localDb, syncWithBackend]);

  const contextValue = useMemo(
    () => ({ todos, backendConnection, addTodo, updateTodoStatus, syncWithBackend, deleteTodo }),
    [todos, backendConnection, addTodo, updateTodoStatus, syncWithBackend, deleteTodo]
  );

  return <LocalDbContext.Provider value={contextValue}>{children}</LocalDbContext.Provider>;
};

export const useLocalDbContext = () => {
  const context = useContext(LocalDbContext);
  if (!context) {
    throw new Error("useLocalDbContext must be used within a LocalDbProvider");
  }
  return context;
};
