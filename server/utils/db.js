import sqlite3 from "sqlite3"
import fs from "fs";

if (!fs.existsSync("./database")) {
  fs.mkdirSync(dbFolderPath, { recursive: true }); 
  console.log(`Created database folder at ${dbFolderPath}`);
}

const db = new sqlite3.Database("./database/products.db", (err) => {
    if (err) {
        console.error("Error opening database:", err)
    } else {
        console.log("Connected to the SQLite database.")
    }
})

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      roles TEXT NOT NULL,
      secret_phrase TEXT NOT NULL
    )
  `)

});

export default db;