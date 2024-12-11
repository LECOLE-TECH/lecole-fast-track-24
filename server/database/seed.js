import db from "./db.js";
import bcrypt from "bcrypt";

const seedData = [
	{
		name: "Product A",
		description: "Description of Product A",
		price: 19.99,
		stock: 100,
	},
	{
		name: "Product B",
		description: "Description of Product B",
		price: 29.99,
		stock: 150,
	},
	{
		name: "Product C",
		description: "Description of Product C",
		price: 9.99,
		stock: 200,
	},
	{
		name: "Product D",
		description: "Description of Product D",
		price: 49.99,
		stock: 80,
	},
	{
		name: "Product E",
		description: "Description of Product E",
		price: 24.99,
		stock: 50,
	},
	{
		name: "Product F",
		description: "Description of Product F",
		price: 14.99,
		stock: 120,
	},
	{
		name: "Product G",
		description: "Description of Product G",
		price: 39.99,
		stock: 60,
	},
	{
		name: "Product H",
		description: "Description of Product H",
		price: 59.99,
		stock: 40,
	},
	{
		name: "Product I",
		description: "Description of Product I",
		price: 22.99,
		stock: 130,
	},
	{
		name: "Product J",
		description: "Description of Product J",
		price: 17.99,
		stock: 110,
	},
	{
		name: "Product K",
		description: "Description of Product K",
		price: 27.99,
		stock: 95,
	},
	{
		name: "Product L",
		description: "Description of Product L",
		price: 34.99,
		stock: 75,
	},
	{
		name: "Product M",
		description: "Description of Product M",
		price: 12.99,
		stock: 160,
	},
	{
		name: "Product N",
		description: "Description of Product N",
		price: 44.99,
		stock: 55,
	},
	{
		name: "Product O",
		description: "Description of Product O",
		price: 19.49,
		stock: 140,
	},
	{
		name: "Product P",
		description: "Description of Product P",
		price: 25.99,
		stock: 85,
	},
	{
		name: "Product Q",
		description: "Description of Product Q",
		price: 31.99,
		stock: 70,
	},
	{
		name: "Product R",
		description: "Description of Product R",
		price: 16.99,
		stock: 125,
	},
	{
		name: "Product S",
		description: "Description of Product S",
		price: 21.99,
		stock: 115,
	},
	{
		name: "Product T",
		description: "Description of Product T",
		price: 38.99,
		stock: 65,
	},
	{
		name: "Product U",
		description: "Description of Product U",
		price: 13.99,
		stock: 135,
	},
	{
		name: "Product V",
		description: "Description of Product V",
		price: 28.99,
		stock: 90,
	},
	{
		name: "Product W",
		description: "Description of Product W",
		price: 35.99,
		stock: 70,
	},
	{
		name: "Product X",
		description: "Description of Product X",
		price: 18.99,
		stock: 105,
	},
	{
		name: "Product Y",
		description: "Description of Product Y",
		price: 23.99,
		stock: 100,
	},
	{
		name: "Product Z",
		description: "Description of Product Z",
		price: 30.99,
		stock: 80,
	},
	{
		name: "Product AA",
		description: "Description of Product AA",
		price: 20.99,
		stock: 95,
	},
	{
		name: "Product AB",
		description: "Description of Product AB",
		price: 26.99,
		stock: 85,
	},
	{
		name: "Product AC",
		description: "Description of Product AC",
		price: 32.99,
		stock: 75,
	},
	{
		name: "Product AD",
		description: "Description of Product AD",
		price: 15.99,
		stock: 130,
	},
	{
		name: "Product AE",
		description: "Description of Product AE",
		price: 19.49,
		stock: 120,
	},
	{
		name: "Product AF",
		description: "Description of Product AF",
		price: 24.99,
		stock: 100,
	},
	{
		name: "Product AG",
		description: "Description of Product AG",
		price: 29.99,
		stock: 90,
	},
	{
		name: "Product AH",
		description: "Description of Product AH",
		price: 34.99,
		stock: 70,
	},
	{
		name: "Product AI",
		description: "Description of Product AI",
		price: 11.99,
		stock: 150,
	},
	{
		name: "Product AJ",
		description: "Description of Product AJ",
		price: 40.99,
		stock: 60,
	},
	{
		name: "Product AK",
		description: "Description of Product AK",
		price: 17.49,
		stock: 115,
	},
	{
		name: "Product AL",
		description: "Description of Product AL",
		price: 22.49,
		stock: 105,
	},
	{
		name: "Product AM",
		description: "Description of Product AM",
		price: 37.99,
		stock: 65,
	},
	{
		name: "Product AN",
		description: "Description of Product AN",
		price: 14.99,
		stock: 140,
	},
	{
		name: "Product AO",
		description: "Description of Product AO",
		price: 28.49,
		stock: 85,
	},
	{
		name: "Product AP",
		description: "Description of Product AP",
		price: 33.99,
		stock: 75,
	},
	{
		name: "Product AQ",
		description: "Description of Product AQ",
		price: 16.49,
		stock: 125,
	},
	{
		name: "Product AR",
		description: "Description of Product AR",
		price: 21.49,
		stock: 115,
	},
	{
		name: "Product AS",
		description: "Description of Product AS",
		price: 39.99,
		stock: 60,
	},
	{
		name: "Product AT",
		description: "Description of Product AT",
		price: 12.49,
		stock: 135,
	},
	{
		name: "Product AU",
		description: "Description of Product AU",
		price: 27.49,
		stock: 90,
	},
	{
		name: "Product AV",
		description: "Description of Product AV",
		price: 36.99,
		stock: 70,
	},
	{
		name: "Product AW",
		description: "Description of Product AW",
		price: 19.99,
		stock: 100,
	},
	{
		name: "Product AX",
		description: "Description of Product AX",
		price: 24.49,
		stock: 95,
	},
	{
		name: "Product AY",
		description: "Description of Product AY",
		price: 29.49,
		stock: 85,
	},
	{
		name: "Product AZ",
		description: "Description of Product AZ",
		price: 34.49,
		stock: 75,
	},
];

const seedUserData = [
	{
		username: "user1",
		password: "123456",
		roles: "user",
		secret_phrase: "secret123",
	},
	{
		username: "admin1",
		password: "123456",
		roles: "admin",
		secret_phrase: "admin123",
	},
	{
		username: "user2",
		password: "123456",
		roles: "user",
		secret_phrase: "secret456",
	},
	{
		username: "admin2",
		password: "123456",
		roles: "admin",
		secret_phrase: "admin456",
	},
];

const seedProductsDatabase = () => {
	db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
		if (err) {
			console.error("Error counting products:", err.message);
			return;
		}
		if (row.count === 0) {
			const stmt = db.prepare(
				"INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
			);
			for (const product of seedData) {
				stmt.run(
					[product.name, product.description, product.price, product.stock],
					(err) => {
						if (err) {
							console.error("Error inserting product:", err.message);
						}
					},
				);
			}
			stmt.finalize(() => {
				console.log("Database seeded with initial products.");
			});
		} else {
			console.log("Database already contains products. Seeding skipped.");
		}
	});
};

const seedUsersDatabase = () => {
	db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
		if (err) {
			console.error("Error counting users:", err.message);
			return;
		}
		if (row?.count === 0) {
			const stmt = db.prepare(
				"INSERT INTO users (username, password, roles, secret_phrase) VALUES (?, ?, ?, ?)",
			);
			for (const user of seedUserData) {
				stmt.run(user.username, user.password, user.roles, user.secret_phrase);
			}
			stmt.finalize();
			console.log("Database seeded with users data");
		} else {
			console.log("Database already contains users. Seeding skipped.");
		}
	});
};

seedProductsDatabase();
seedUsersDatabase();
