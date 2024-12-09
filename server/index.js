import express from "express";
import funcProductRoute from "./routes/product.route.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173 " }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

funcProductRoute(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
