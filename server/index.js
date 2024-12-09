import express from "express"
import { expressApplication } from "./app.js"

const app = express()
const port = 3000

expressApplication(app)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// app.get("/lecole/api/product", (req, res) => {
//   db.all("SELECT * FROM products", [], (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message })
//       return
//     }
//     res.json(rows)
//   })
// })
