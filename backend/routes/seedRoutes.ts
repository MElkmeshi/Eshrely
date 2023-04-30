import express, { Request, Response } from "express";
import Product from "../models/productModel";
import data from "../src/data";
import User from "../models/userModel";

const seedRouter = express.Router();

seedRouter.get("/", async (req: Request, res: Response) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
