export class TodoService {
  constructor(db) {
    this.db = db;
  }

  getAllTodos() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM todos ORDER BY created_at DESC", [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  createTodo(title, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO todos (title, status) VALUES (?, ?)",
        [title, status],
        function(err) {
          if (err) reject(err);
          this.db.get(
            "SELECT * FROM todos WHERE id = ?",
            [this.lastID],
            (err, row) => {
              if (err) reject(err);
              resolve(row);
            }
          );
        }
      );
    });
  }

  updateTodoStatus(id, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE todos SET status = ? WHERE id = ?",
        [status, id],
        function(err) {
          if (err) reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  syncTodos(todos) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");
        
        todos.forEach(todo => {
          this.db.get("SELECT id FROM todos WHERE id = ?", [todo.id], (err, row) => {
            if (!row) {
              this.db.run(
                "INSERT INTO todos (title, status) VALUES (?, ?)",
                [todo.title, todo.status]
              );
            } else {
              this.db.run(
                "UPDATE todos SET status = ? WHERE id = ?",
                [todo.status, todo.id]
              );
            }
          });
        });

        this.db.run("COMMIT", [], (err) => {
          if (err) {
            this.db.run("ROLLBACK");
            reject(err);
          }
          this.getAllTodos().then(resolve).catch(reject);
        });
      });
    });
  }

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
        if (err) reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}
