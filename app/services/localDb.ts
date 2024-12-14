import type { Todo } from "~/types/todo";


export class LocalDbService {
  private db: any;

  async initialize() {
    const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm")).default;
    const sqlite3 = await sqlite3InitModule();
    this.db = new sqlite3.oo1.DB("/local-todos.sqlite3", "ct");
    
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
        synced INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return this.db;
  }

  getTodos(): Todo[] {
    const results: Todo[] = [];
    this.db.exec({
      sql: "SELECT id, title, status, synced, created_at FROM todos ORDER BY created_at DESC",
      callback: (row: any) => {
        results.push({
          id: row[0],
          title: row[1],
          status: row[2],
          synced: Boolean(row[3]),
          created_at: row[4]
        });
      }
    });
    return results;
  }

  addTodo(title: string) {
    let newId: number;
    this.db.exec({
      sql: "INSERT INTO todos (title, synced) VALUES (?, 0)",
      bind: [title]
    });
  }

  updateTodoStatus(todoId: number, status: Todo["status"]) {
    this.db.exec({
      sql: "UPDATE todos SET status = ?, synced = 0 WHERE id = ?",
      bind: [status, todoId]
    });
  }

  getUnsyncedTodos(): Partial<Todo>[] {
    const unsyncedTodos: Partial<Todo>[] = [];
    this.db.exec({
      sql: "SELECT id, title, status FROM todos WHERE synced = 0",
      callback: (row: any) => {
        unsyncedTodos.push({
          id: row[0],
          title: row[1],
          status: row[2]
        });
      }
    });
    return unsyncedTodos;
  }

  syncTodos(serverTodos: Todo[]) {
    this.db.exec("BEGIN TRANSACTION");
    this.db.exec("UPDATE todos SET synced = 1");

    serverTodos.forEach((todo: Todo) => {
      let exists = false;
      this.db.exec({
        sql: "SELECT COUNT(*) as count FROM todos WHERE id = ?",
        bind: [todo.id],
        callback: (row: any) => {
          exists = row[0] > 0;
        }
      });

      if (exists) {
        this.db.exec({
          sql: "UPDATE todos SET title = ?, status = ?, synced = 1 WHERE id = ?",
          bind: [todo.title, todo.status, todo.id]
        });
      } else {
        this.db.exec({
          sql: "INSERT INTO todos (id, title, status, synced) VALUES (?, ?, ?, 1)",
          bind: [todo.id, todo.title, todo.status]
        });
      }
    });

    this.db.exec("COMMIT");
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export const localDbService = new LocalDbService();
