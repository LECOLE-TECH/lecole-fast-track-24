import db from '../model/productModel.js';

class ProductService {
  constructor() {
    this.seedData = [
      {
        name: "Earthen Bottle",
        description: "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
        price: 48.00,
        stock: 100,
        image_url: "https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg"
      },
      {
        name: "Nomad Tumbler",
        description: "Olive drab green insulated bottle with flared screw lid and flat top.",
        price: 35.00,
        stock: 150,
        image_url: "https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg"
      },
      {
        name: "Focus Paper Refill",
        description: "Person using a pen to cross a task off a productivity paper card.",
        price: 89.00,
        stock: 200,
        image_url: "https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg"
      },
      {
        name: "Machined Mechanical Pencil",
        description: "Hand holding black machined steel mechanical pencil with brass tip and top.",
        price: 35.00,
        stock: 80,
        image_url: "https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg"
      }
    ];
  }

  async getAllProducts() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  async seedProducts() {
    return new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row?.count === 0) {
          const stmt = db.prepare("INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)");
          for (const product of this.seedData) {
            stmt.run(product.name, product.description, product.price, product.stock, product.image_url);
          }
          stmt.finalize();
          console.log("Database seeded with dummy data");
          resolve("Database seeded successfully");
        } else {
          resolve("Database already contains data");
        }
      });
    });
  }

  async initializeDatabase() {
    try {
      await this.seedProducts();
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
}

export default new ProductService();