import express, { Request, Response } from "express";
import Product from "../models/productModel";

const productRouter = express.Router();

productRouter.get("/", async (req: express.Request, res: express.Response) => {
  const products = await Product.find({});
  res.send(products);
});

productRouter.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while fetching the product." });
  }
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while fetching the product." });
  }
});
export default productRouter;
