import { StatusCodes } from "http-status-codes"
import { SuccessResponse } from "../utils/http-response.js"
import { db } from "../configs/db.config.js"

export const SyncDataTodos = async (req, res) => {
  try {
    const { data: todos } = req.body

    if (!Array.isArray(todos)) {
      return res.status(400).json({ error: "Invalid request format" })
    }

    db.exec("BEGIN TRANSACTION")
    for (const todo of todos) {
      const { id, title, status } = todo

      db.run(
        `
        INSERT INTO todos (id, title, status, synced)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(id)
        DO UPDATE SET title = excluded.title, status = excluded.status, synced = 1
        `,
        [id, title, status]
      )
    }

    db.exec("COMMIT")

    db.all("SELECT * FROM todos", (err, todos) => {
      console.log("todos", todos)
      if (err) {
        return res.status(500).json({ error: "Failed to sync todos" })
      }

      const data = {
        todos
      }

      const success = new SuccessResponse(
        "Create product successfully",
        StatusCodes.OK,
        data
      )

      return success.send(res)
    })
  } catch (error) {
    console.error("Sync failed:", error)
    res.status(500).json({ error: "Failed to sync todos" })
    db.exec("ROLLBACK")
  }
}

//

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params

    db.run(
      `
      DELETE FROM todos WHERE id = ?
      `,
      [id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete todo" })
        }

        const success = new SuccessResponse(
          "Delete todo successfully",
          StatusCodes.OK
        )

        return success.send(res)
      }
    )
  } catch (error) {
    console.error("Delete todo failed:", error)
    res.status(500).json({ error: "Failed to delete todo" })
  }
}
