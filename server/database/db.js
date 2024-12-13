import sqlite3 from "sqlite3";

const DBSOURCE = process.env.DB_PATH || "./database/products.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error("Error opening database:", err.message);
		throw err;
	} else {
		console.log("Connected to the SQLite database.");
		db.run(
			`CREATE TABLE IF NOT EXISTS products (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT,
				price REAL NOT NULL,
				stock INTEGER NOT NULL
			)`,
			(err) => {
				if (err) {
					console.error("Error creating products table:", err.message);
				} else {
					console.log("Products table exists or created successfully.");
				}
			},
		);
		db.run(
			`CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				roles TEXT NOT NULL,
				secret_phrase TEXT NOT NULL
			)`,
			(err) => {
				if (err) {
					console.error("Error creating users table:", err.message);
				} else {
					console.log("Users table exists or created successfully.");
				}
			},
		);

		db.serialize(() => {
			db.run(`
			CREATE TABLE IF NOT EXISTS todos (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  title TEXT NOT NULL,
			  status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
			  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		  `);

			db.run(`
			CREATE TRIGGER IF NOT EXISTS update_todos_timestamp
			AFTER UPDATE ON todos
			BEGIN
				UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
		  `);
		});
	}
});

export default db;
