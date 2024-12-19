import sqlite3InitModule from "@sqlite.org/sqlite-wasm"
import { Todo } from "../../types/interface"

const log = console.log
const error = console.error

type Sqlite3 = {
  version: {
    libVersion: string
  }
  oo1: {
    OpfsDb: new (filename: string) => any
    DB: new (filename: string, mode: string) => any
  }
  capi: {
    sqlite3_vfs_find: (name: string) => any
  }
}

const start = (sqlite3: Sqlite3) => {
  log("Running SQLite3 version", sqlite3.version.libVersion)
  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb("/mydb.sqlite3")
      : new sqlite3.oo1.DB("/mydb.sqlite3", "ct")
  log(
    "opfs" in sqlite3
      ? `OPFS is available, created persisted database at ${db.filename}`
      : `OPFS is not available, created transient database ${db.filename}`
  )
  // Create the local todos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT CHECK(status IN ('backlog', 'in_progress', 'done')) NOT NULL DEFAULT 'backlog',
      synced INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  let dummyDataExists = false
  db.exec({
    sql: "SELECT COUNT(*) AS count FROM todos",
    rowMode: "object",
    callback: (row: any) => {
      if (row.count > 0) {
        dummyDataExists = true
      }
    }
  })

  if (!dummyDataExists) {
    db.exec(`
            INSERT INTO todos (title, status, synced) VALUES ('Learn SQLite', 'backlog', 0),
                                                              ('Learn React', 'in_progress', 0),
                                                              ('Learn Next.js', 'done', 0)
          `)
  }

  self.postMessage({ type: "init", success: true })

  self.onmessage = async (event) => {
    const { type, sql, params, queries } = event.data

    if (type === "exec") {
      try {
        db.exec({
          sql,
          bind: params
        })
        self.postMessage({ type: "exec", success: true })
      } catch (err: any) {
        self.postMessage({ type: "exec", success: false, error: err.message })
      }
    } else if (type === "query") {
      try {
        const results: Todo[] = []
        db.exec({
          sql,
          params,
          callback: (row: any) => {
            results.push({
              id: row[0],
              title: row[1],
              status: row[2],
              synced: Boolean(row[3]),
              created_at: row[4]
            })
          }
        })
        self.postMessage({
          type: "query",
          success: true,
          db,
          result: results
        })
      } catch (err: any) {
        self.postMessage({ type: "query", success: false, error: err.message })
      }
    } else if (type === "transaction") {
      try {
        db.exec("BEGIN TRANSACTION")
        queries.forEach((query: any) => {
          db.exec({
            sql: query.sql,
            bind: query.params
          })
        })
        db.exec("COMMIT")
        self.postMessage({ type: "transaction", success: true })
      } catch (err: any) {
        db.exec("ROLLBACK")
        self.postMessage({ type, success: false, error: err.message })
      }
    }
  }
}

const initializeSQLite = async () => {
  try {
    log("Loading and initializing SQLite3 module...")
    const sqlite3: Sqlite3 = await sqlite3InitModule({
      print: log,
      printErr: error
    })
    log("Done initializing. Running demo...")
    start(sqlite3)
  } catch (e: any) {
    error(`Could not initialize database: ${e.message}`)
  }
}

initializeSQLite()
