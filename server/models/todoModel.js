import db from "../database/db.js";

// Retrieve all todos ordered by creation date descending
export const getAllTodos = () => {
	return new Promise((resolve, reject) => {
		db.all("SELECT * FROM todos ORDER BY created_at DESC", [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

// Create a new todo
export const createTodo = ({ title, status = "backlog" }) => {
	return new Promise((resolve, reject) => {
		if (!title) {
			reject(new Error("Title is required"));
			return;
		}

		db.run(
			"INSERT INTO todos (title, status) VALUES (?, ?)",
			[title, status],
			function (err) {
				if (err) {
					reject(err);
				} else {
					// Retrieve the newly created todo
					db.get(
						"SELECT * FROM todos WHERE id = ?",
						[this.lastID],
						(err, row) => {
							if (err) {
								reject(err);
							} else {
								resolve(row);
							}
						},
					);
				}
			},
		);
	});
};

// Update todo status by ID
export const updateTodoStatus = (id, status) => {
	return new Promise((resolve, reject) => {
		if (!status || !["backlog", "in_progress", "done"].includes(status)) {
			reject(new Error("Valid status is required"));
			return;
		}

		db.run(
			"UPDATE todos SET status = ? WHERE id = ?",
			[status, id],
			function (err) {
				if (err) {
					reject(err);
				} else if (this.changes === 0) {
					reject(new Error("Todo not found"));
				} else {
					resolve({ id, status });
				}
			},
		);
	});
};

// Delete todo by ID
export const deleteTodo = (id) => {
	return new Promise((resolve, reject) => {
		db.run("DELETE FROM todos WHERE id = ?", id, function (err) {
			if (err) {
				reject(err);
			} else if (this.changes === 0) {
				reject(new Error("Todo not found"));
			} else {
				resolve({ message: "Todo deleted successfully" });
			}
		});
	});
};

// Sync multiple todos
export const syncTodos = (todos) => {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(todos)) {
			reject(new Error("Invalid sync data format"));
			return;
		}

		db.serialize(() => {
			db.run("BEGIN TRANSACTION", (err) => {
				if (err) {
					reject(err);
					return;
				}

				const updateStmt = db.prepare(
					"UPDATE todos SET status = ? WHERE id = ?",
				);
				const insertStmt = db.prepare(
					"INSERT INTO todos (title, status) VALUES (?, ?)",
				);

				todos.forEach((todo) => {
					if (todo.id) {
						db.get(
							"SELECT id FROM todos WHERE id = ?",
							[todo.id],
							(err, row) => {
								if (err) {
									throw err;
								}
								if (row) {
									console.log("Updating existing todo:", todo);
									updateStmt.run([todo.status, todo.id]);
								} else {
									console.log("Todo not found:", todo.id);
									insertStmt.run([todo.title, todo.status]);
									console.log("Inserted new todo:", todo);
								}
							},
						);
						// Update existing todo
					}
				});

				db.run("COMMIT", (err) => {
					if (err) {
						db.run("ROLLBACK");
						reject(err);
						return;
					}

					// Retrieve all todos after sync
					db.all(
						"SELECT * FROM todos ORDER BY created_at DESC",
						[],
						(err, rows) => {
							if (err) {
								reject(err);
							} else {
								resolve(rows);
							}
						},
					);
				});
			});
		});
	});
};
