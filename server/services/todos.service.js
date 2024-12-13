import sqlite3 from "sqlite3";

class TodosService {
  constructor() {
    this.db = new sqlite3.Database("./database/todos.db", (err) => {
      if (err) {
        console.error("Error opening database:", err);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });

    this.initialDb();
  }

  initialDb() {
    this.db.serialize(() => {
      this.db.run(`
            CREATE TABLE IF NOT EXISTS todos (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
    });
    this.seedData();
  }

  seedData() {
    // Seed some initial todos if the table is empty
    const seedTodos = [
      { title: "Learn React", status: "done" },
      { title: "Build a Todo App", status: "in_progress" },
      { title: "Master TypeScript", status: "backlog" },
    ];

    this.db.get("SELECT COUNT(*) as count FROM todos", (err, row) => {
      if (row?.count === 0) {
        const stmt = this.db.prepare(
          "INSERT INTO todos (title, status) VALUES (?, ?)"
        );
        seedTodos.forEach((todo) => {
          stmt.run(todo.title, todo.status);
        });
        stmt.finalize();
        console.log("Database seeded with initial todos");
      }
    });
  }

  async getAllTodos() {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM todos ORDER BY created_at DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        }
      );
    });
  }

  async createTodo(title, status) {
    return new Promise((resolve, reject) => {
      const self = this;
      this.db.run(
        "INSERT INTO todos (title, status) VALUES (?, ?)",
        [title, status],
        function (err) {
          if (err) {
            reject(err);
          } else {
            const lastID = this.lastID;
            self.db.get(
              "SELECT * FROM todos WHERE id = ?",
              [lastID],
              (err, row) => {
                if (err) reject(err);
                resolve(row);
              }
            );
          }
        }
      );
    });
  }

  async updateTodo(id, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE todos SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  async deleteTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM todos WHERE id = ?", id, function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async syncMultiTodo(todos) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        try {
          this.db.run("BEGIN TRANSACTION");

          // Process each todo from the client
          todos.forEach((todo) => {
            if (todo.id) {
              // Update existing todo
              this.db.run("UPDATE todos SET status = ? WHERE id = ?", [
                todo.status,
                todo.id,
              ]);
            } else {
              // Insert new todo
              this.db.run("INSERT INTO todos (title, status) VALUES (?, ?)", [
                todo.title,
                todo.status,
              ]);
            }
          });

          this.db.run("COMMIT", [], (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            // Return all todos after sync
            this.db.all(
              "SELECT * FROM todos ORDER BY created_at DESC",
              [],
              (err, rows) => {
                if (err) {
                  reject(err);
                }
                resolve(rows);
              }
            );
          });
        } catch (err) {
          this.db.run("ROLLBACK");
          reject(err);
        }
      });
    });
  }
}

export default new TodosService();
