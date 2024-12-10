import { faker } from "@faker-js/faker"

function generateProduct() {
  const price = parseFloat(faker.commerce.price(10, 1000))

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price,
    stock: faker.number.int({ min: 0, max: 500 }),
    category: faker.commerce.department(),
    image: faker.image.url(640, 480, undefined, true),
    brand: faker.company.name()
  }
}

const productsDummy = Array.from({ length: 100 }, generateProduct)

export const insertProductsDummy = (db) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT,
      image TEXT,
<<<<<<< HEAD
      brand TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
=======
      brand TEXT
>>>>>>> b57baeca8064e46d519f66afb2e6f3434268dadb
      )
    `)
  })

  db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
      if (row?.count === 0) {
        const stmt = db.prepare(
          "INSERT INTO products (name, description, price, stock, category, image, brand) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        for (const product of productsDummy) {
          stmt.run(
            product.name,
            product.description,
            product.price,
            product.stock,
            product.category,
            product.image,
            product.brand
          )
        }
        stmt.finalize()
        console.log("Database seeded with dummy data")
      }
    })
  })
}
