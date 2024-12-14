import { syncTodos } from "~/apis/todosApi";
import type { Todo, TodoLocal } from "~/types/todos";

/**
 * Never(!) rely on garbage collection to clean up DBs and
 * (especially) prepared statements. Always wrap theire lifetimes
 * in a try/finally construct. By and large, client code can entirely
 * avoid lifetime-related complications of prepared statments objects
 * using the DB.exec() method of SQL execution.
 *
 * More information on: https://sqlite.org/wasm/doc/trunk/api-oo1.md
 */

class LocalDatbase {
  public db: any = null;
  public initialized: boolean = false;

  async init(): Promise<any> {
    if (this.initialized) return;

    try {
      const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm"))
        .default;
      const sqlite3 = await sqlite3InitModule();

      /**
       *  {
       *    filename: db filename,
       *    flags: open-mode flags,
       *    vfs: name of the sqlite3_vfs to use,
       *  }
       */
      this.db =
        "opfs" in sqlite3
          ? new sqlite3.oo1.OpfsDb("/local-todos.sqlite3")
          : new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");
      console.log(
        "opfs" in sqlite3
          ? `OPFS is available, created persisted database at ${this.db.filename}`
          : `OPFS is not available, created transient database ${this.db.filename}`
      );
      await this.createTables();
      this.initialized = true;

      return this.db;
    } catch (error) {
      console.error("Failed to initialize SQLite database:", error);
      throw new Error("Failed to initialize local database");
    }
  }

  private async createTables() {
    if (!this.db) throw new Error("Database not initialized");
    try {
      this.db.exec(`
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
      throw new Error("Error while creating tables");
    }
  }

  public async loadLocalData(): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
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
    } catch (error) {
      console.error(error);
      throw new Error("Error while load local data");
    }
  }

  public async addTodo(title: string): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      this.db.exec({
        sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
        bind: [title],
      });

      return await this.loadLocalData();
    } catch (error) {
      console.error(error);
      throw new Error("Error while adding Todo");
    }
  }

  public async updateTodoStatus(
    todoId: number,
    newStatus: Todo["status"]
  ): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      this.db.exec({
        sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
        bind: [newStatus, todoId],
      });

      return await this.loadLocalData();
    } catch (error) {
      console.error(error);
      throw new Error("Error while updating TodoStatus");
    }
  }

  public async deleteTodo(todoId: number): Promise<TodoLocal[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      this.db.exec({
        sql: "DELETE FROM todos WHERE id = ?",
        bind: [todoId],
      });

      return await this.loadLocalData();
    } catch (error) {
      console.error(error);
      throw new Error("Error while deleting Todo");
    }
  }

  public async syncWithBackend(): Promise<TodoLocal[]> {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error("Error while syncing with Backend");
    }
  }

  public async loadAllUnsyncedTodos(): Promise<Partial<TodoLocal>[]> {
    if (!this.db) throw new Error("Database not initialized");
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error("Error while loading all unsynced Todos");
    }
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
