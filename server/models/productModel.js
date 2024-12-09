import db from "../database/db.js";

export const getAllProducts = () => {
	return new Promise((resolve, reject) => {
		db.all("SELECT * FROM products", [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const getProductById = (id) => {
	return new Promise((resolve, reject) => {
		db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};

export const createProduct = ({ name, description, price, stock }) => {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare(
			"INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
		);
		stmt.run([name, description, price, stock], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve({ id: this.lastID, name, description, price, stock });
			}
		});
		stmt.finalize();
	});
};

export const updateProduct = (id, { name, description, price, stock }) => {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare(
			"UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
		);
		stmt.run([name, description, price, stock, id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve({
					id: Number(id),
					name,
					description,
					price,
					stock,
					changes: this.changes,
				});
			}
		});
		stmt.finalize();
	});
};

export const deleteProduct = (id) => {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare("DELETE FROM products WHERE id = ?");
		stmt.run([id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve({ changes: this.changes });
			}
		});
		stmt.finalize();
	});
};
