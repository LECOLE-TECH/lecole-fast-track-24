import sqlite3 from "sqlite3"

class Database {
  constructor() {
    if (!Database.instance) {
      this._db = new sqlite3.Database("./database/products.db", (err) => {
        if (err) {
          console.error("Error opening database:", err)
        } else {
          console.log("Connected to the SQLite database.")
        }
      })
      Database.instance = this
    }
    return Database.instance
  }

  getInstance() {
    return this._db
  }

  closeConnection() {
    this._db.close((err) => {
      if (err) {
        console.error("Error closing database:", err)
      } else {
        console.log("Database connection closed.")
      }
    })
  }
}

export const connectDatabase = () => {
  return new Database()
}
export const db = connectDatabase().getInstance()
