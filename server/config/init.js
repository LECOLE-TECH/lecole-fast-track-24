import sqlite3 from "sqlite3";

export function initializeDatabase() {
  const db = new sqlite3.Database("./database/todos.db", (err) => {
    if (err) {
      console.error("Error opening database:", err);
    } else {
      console.log("Connected to the SQLite database.");
    }
  });

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        order_index INTEGER DEFAULT 0
      )
    `);

    const seedTodos = [
      { title: "Learn React", status: "done", order_index: 0 },
      { title: "Build a Todo App", status: "in_progress", order_index: 1 },
      { title: "Master TypeScript", status: "backlog", order_index: 2 },
    ];

    db.get("SELECT COUNT(*) as count FROM todos", (err, row) => {
      if (row?.count === 0) {
        const stmt = db.prepare("INSERT INTO todos (title, status, order_index) VALUES (?, ?, ?)");
        seedTodos.forEach(todo => {
          stmt.run(todo.title, todo.status, todo.order_index);
        });
        stmt.finalize();
        console.log("Database seeded with initial todos");
      }
    });  });

  return db;
}
