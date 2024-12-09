import sqlite3 from "sqlite3";

const DBSOURCE = "./database/products.db";

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
					console.error("Error creating table:", err.message);
				} else {
					console.log("Products table exists or created successfully.");
				}
			},
		);
	}
});

export default db;
