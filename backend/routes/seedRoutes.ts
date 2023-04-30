import express from "express";
import Product from "../models/ProductModel";
import data from "../src/data";

const seedRouter = express.Router();

seedRouter.get("/", async (req: express.Request, res: express.Response) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});
export default seedRouter;
