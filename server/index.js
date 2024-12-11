import express from "express"
import { expressApplication } from "./app.js"

const app = express()
const port = 3000

expressApplication(app)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
