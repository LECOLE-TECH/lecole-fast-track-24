import { faker } from "@faker-js/faker"

function generateProduct() {
  const price = parseFloat(faker.commerce.price(10, 1000))

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price,
    stock: faker.number.int({ min: 0, max: 500 }),
    category: faker.commerce.department(),
    image: faker.image.urlPicsumPhotos(640, 480, undefined, true),
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
      brand TEXT
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
        console.log("Database seeded with dummy data products")
      }
    })
  })
}

function generateUser() {
  const avatar = faker.image.urlPicsumPhotos(200, 200, undefined, true)
  const roles = ["user"]
  const role = faker.helpers.arrayElement(roles)

  return {
    avatar: avatar,
    username: faker.internet.displayName(),
    role,
    secret: faker.lorem.words(3)
  }
}

const usersDummy = Array.from({ length: 100 }, generateUser)

export const insertUsersDummy = (db) => {
  db.serialize(() => {
    db.run(`
       CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      avatar TEXT,
      username TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      secret TEXT
      )
    `)
  })

  db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
      if (row?.count === 0) {
        const stmt = db.prepare(
          "INSERT INTO users (avatar, username, role, secret) VALUES (?, ?, ?, ?)"
        )
        for (const user of usersDummy) {
          stmt.run(user.avatar, user.username, user.role, user.secret)
        }
        stmt.finalize()
        console.log("Database seeded with dummy user data")
      }
    })
  })
}