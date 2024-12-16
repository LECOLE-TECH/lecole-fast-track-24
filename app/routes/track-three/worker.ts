import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { syncTodos } from "~/apis/todosApi";
import type { Todo, TodoLocal } from "~/types/todos";

let db: any = null;

export const initializeSQLite = async (): Promise<TodoLocal[]> => {
  try {
    const sqlite3 = await sqlite3InitModule();
    return await start(sqlite3);
  } catch (error) {
    console.log(error);
    throw new Error("Error while initializing SQLite");
  }
};

const createTable = async (db: any): Promise<void> => {
  if (!db) throw new Error("Database not initialized before creating table");
  try {
    db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
            synced INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
  } catch (error) {
    console.error(error);
    throw new Error("Error while creating tables on worker");
  }
};

const start = async (sqlite3: any): Promise<TodoLocal[]> => {
  db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb("/local-todos.sqlite3")
      : new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");
  console.log(
    "opfs" in sqlite3
      ? `OPFS is available, created persisted database at ${db.filename}`
      : `OPFS is not available, created transient database ${db.filename}`
  );

  await createTable(db);
  return await loadLocalData();
};

export const loadLocalData = async (): Promise<TodoLocal[]> => {
  if (!db)
    throw new Error("Database not initialized before loading local data");

  try {
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
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Error while load local data");
  }
};

export const loadAllUnsyncedTodos = async (): Promise<Partial<TodoLocal>[]> => {
  if (!db)
    throw new Error(
      "Database not initialized before loading all unsycned todos"
    );
  try {
    const unsyncedTodos: Partial<TodoLocal>[] = [];
    db.exec({
      sql: "SELECT id, title, status FROM todos WHERE synced = 0",
      callback: (row: any) => {
        unsyncedTodos.push({
          id: row[0],
          title: row[1],
          status: row[2],
        } as const);
      },
    });
    return unsyncedTodos;
  } catch (error) {
    console.error(error);
    throw new Error("Error while loading all unsynced Todos");
  }
};

export const addTodo = async (title: string): Promise<TodoLocal[]> => {
  if (!db) throw new Error("Database not initialized before adding todo");

  try {
    db.exec({
      sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
      bind: [title],
    });

    return await loadLocalData();
  } catch (error) {
    console.error(error);
    throw new Error("Error while adding Todo");
  }
};

export const updateTodoStatus = async (
  todoId: number,
  newStatus: Todo["status"]
): Promise<TodoLocal[]> => {
  if (!db) throw new Error("Database not initialized before updating todo");

  try {
    db.exec({
      sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
      bind: [newStatus, todoId],
    });

    return await loadLocalData();
  } catch (error) {
    console.error(error);
    throw new Error("Error while updating TodoStatus");
  }
};

export const deleteTodo = async (todoId: number): Promise<TodoLocal[]> => {
  if (!db) throw new Error("Database not initialized before deleting todo");

  try {
    db.exec({
      sql: "DELETE FROM todos WHERE id = ?",
      bind: [todoId],
    });

    return await loadLocalData();
  } catch (error) {
    console.error(error);
    throw new Error("Error while deleting Todo");
  }
};

export const syncWithBackend = async (): Promise<TodoLocal[]> => {
  if (!db)
    throw new Error("Database not initialized before syncing with backend");
  try {
    const unsyncedTodos = await loadAllUnsyncedTodos();
    const serverTodos = await syncTodos(unsyncedTodos as TodoLocal[]);

    // Update local database with server data
    db.exec("BEGIN TRANSACTION");

    // Mark all existing todos as synced
    db.exec("UPDATE todos SET synced = 1");

    // Update or insert server todos
    serverTodos.forEach((todo: Todo) => {
      // Check if todo exists
      let exists = false;
      db.exec({
        sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
        bind: [todo.id],
        callback: (row: any) => {
          exists = row[0] > 0;
        },
      });

      if (exists) {
        // Update existing todo
        db.exec({
          sql: "UPDATE todos SET title = ?, status = ?, synced = 1 WHERE id = ?",
          bind: [todo.title, todo.status, todo.id],
        });
      } else {
        // Insert new todo
        db.exec({
          sql: "INSERT INTO todos (id, title, status, synced) VALUES (?, ?, ?, 1)",
          bind: [todo.id, todo.title, todo.status],
        });
      }
    });

    db.exec("COMMIT");

    return await loadLocalData();
  } catch (error) {
    console.error(error);
    throw new Error("Error while syncing with Backend");
  }
};

let initialData: TodoLocal[] = [];

initializeSQLite()
  .then((data) => {
    initialData = data;
    self.postMessage({ type: "INIT_COMPLETE", payload: data });
  })
  .catch((error) => {
    self.postMessage({ type: "ERROR", payload: error.message });
  });

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  try {
    let results;
    switch (type) {
      case "ADD_TODO":
        results = await addTodo(payload.title);
        break;
      case "UPDATE_TODO_STATUS":
        results = await updateTodoStatus(payload.id, payload.status);
        break;
      case "DELETE_TODO":
        results = await deleteTodo(payload.id);
        break;
      case "SYNC_WITH_BACKEND":
        results = await syncWithBackend();
        break;
      default:
        throw new Error(`Unkown message type: ${type}`);
    }
    self.postMessage({ type: "SUCCESS", payload: results });
  } catch (error: any) {
    self.postMessage({ type: "ERROR", payload: error.message });
  }
};
