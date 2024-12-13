import { syncTodos } from "~/apis/todosApi";
import type { Todo, TodoLocal } from "~/types/todos";

class LocalDatbase {
  public db: any = null;
  public initialized: boolean = false;

  async init() {
    if (this.initialized) return;

    try {
      const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm"))
        .default;
      const sqlite3 = await sqlite3InitModule();
      this.db = new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");

      await this.createTables();
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize SQLite database:", error);
      throw new Error("Failed to initialize local database");
    }
  }

  private async createTables() {
    if (!this.db) throw new Error("Database not initialized");

    this.db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
          synced INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
  }

  public async loadLocalData(): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    const results: TodoLocal[] = [];
    this.db.exec({
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
  }

  public async addTodo(title: string): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    this.db.exec({
      sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
      bind: [title],
    });

    return await this.loadLocalData();
  }

  public async updateTodoStatus(
    todoId: number,
    newStatus: Todo["status"]
  ): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    this.db.exec({
      sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
      bind: [newStatus, todoId],
    });

    return await this.loadLocalData();
  }

  public async deleteTodo(todoId: number): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    this.db.exec({
      sql: "DELETE FROM todos WHERE id = ?",
      bind: [todoId],
    });

    return await this.loadLocalData();
  }

  public async syncWithBackend(): Promise<TodoLocal[]> {
    const unsyncedTodos = await this.loadAllUnsyncedTodos();
    const serverTodos = await syncTodos(unsyncedTodos as TodoLocal[]);

    // Update local database with server data
    this.db.exec("BEGIN TRANSACTION");

    // Mark all existing todos as synced
    this.db.exec("UPDATE todos SET synced = 1");

    // Update or insert server todos
    serverTodos.forEach((todo: Todo) => {
      // Check if todo exists
      let exists = false;
      this.db.exec({
        sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
        bind: [todo.id],
        callback: (row: any) => {
          exists = row[0] > 0;
        },
      });

      if (exists) {
        // Update existing todo
        this.db.exec({
          sql: "UPDATE todos SET title = ?, status = ?, synced = 1 WHERE id = ?",
          bind: [todo.title, todo.status, todo.id],
        });
      } else {
        // Insert new todo
        this.db.exec({
          sql: "INSERT INTO todos (id, title, status, synced) VALUES (?, ?, ?, 1)",
          bind: [todo.id, todo.title, todo.status],
        });
      }
    });

    this.db.exec("COMMIT");

    return await this.loadLocalData();
  }

  public async loadAllUnsyncedTodos(): Promise<Partial<TodoLocal>[]> {
    if (!this.db) throw new Error("Database not initialized");

    const unsyncedTodos: Partial<TodoLocal>[] = [];
    this.db.exec({
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
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

export const localDatabase = new LocalDatbase();
