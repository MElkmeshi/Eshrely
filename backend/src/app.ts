import express from "express";
import data from "./data";
const app = express();
const port = process.env.PORT || 3000;

app.get("/api/products", async (req, res) => {
  res.send(data.products);
});
app.get("/api/products/slug/:slug", async (req, res) => {
  const product = data.products.find(
    (product) => product.slug === req.params.slug
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
