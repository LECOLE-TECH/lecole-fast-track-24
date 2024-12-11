import db from "../database/db.js";
import bcrypt from "bcryptjs";

export const registerUser = (user) => {
	return new Promise(async (resolve, reject) => {
		try {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			const stmt = db.prepare(
				"INSERT INTO users (username, password, roles, secret_phrase) VALUES (?, ?, ?, ?)",
			);
			stmt.run(
				[user.username, hashedPassword, user.roles, user.secret_phrase],
				function (err) {
					if (err) {
						reject(err);
					} else {
						resolve({
							id: this.lastID,
							username: user.username,
							roles: user.roles,
							secret_phrase: user.secret_phrase,
						});
					}
				},
			);
			stmt.finalize();
		} catch (error) {
			reject(error);
		}
	});
};

export const getUserByUsername = (username) => {
	return new Promise((resolve, reject) => {
		db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};

export const getAllUsersFromDB = () => {
	return new Promise((resolve, reject) => {
		db.all(
			"SELECT id, username, roles, secret_phrase FROM users",
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
};

export const getAllUsernamesFromDB = () => {
	return new Promise((resolve, reject) => {
		db.all("SELECT id, username FROM users", [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const getUserByIdFromDB = (id) => {
	return new Promise((resolve, reject) => {
		db.get(
			"SELECT id, username, roles, secret_phrase FROM users WHERE id = ?",
			[id],
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			},
		);
	});
};

export const updateUserSecretPhrase = (id, newSecretPhrase) => {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare("UPDATE users SET secret_phrase = ? WHERE id = ?");
		stmt.run([newSecretPhrase, id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve({ changes: this.changes });
			}
		});
		stmt.finalize();
	});
};
