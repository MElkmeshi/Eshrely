import express from "express";
import data from "./data";
const app = express();
const port = process.env.PORT || 3000;

app.get("/api/products", async (req, res) => {
  res.send(data.products);
});

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
