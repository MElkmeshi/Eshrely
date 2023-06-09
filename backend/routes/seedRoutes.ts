import express, { Request, Response } from "express";
import Product from "../models/productModel";
import User from "../models/userModel";
import bcryptjs from "bcryptjs";

export interface Product {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}
export interface UserInterface {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
export interface Data {
  products: Product[];
  users: UserInterface[];
}

const data: Data = {
  users: [
    {
      name: "Mohamed Elkmeshi",
      email: "elkmeshi2002@gmail.com",
      password: bcryptjs.hashSync("MohElk13241?"),
      isAdmin: true,
    },
    {
      name: "Naeem Allwati",
      email: "nallwati@redtech.ly",
      password: bcryptjs.hashSync("1234"),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: "Nike Slim shirt",
      slug: "nike-slim-shirt",
      category: "Shirts",
      image: "/images/p1.jpg", // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "high quality shirt",
    },
    {
      name: "Adidas Fit Shirt",
      slug: "adidas-fit-shirt",
      category: "Shirts",
      image: "/images/p2.jpg",
      price: 250,
      countInStock: 20,
      brand: "Adidas",
      rating: 4.0,
      numReviews: 10,
      description: "high quality product",
    },
    {
      name: "Nike Slim Pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image: "/images/p3.jpg",
      price: 25,
      countInStock: 15,
      brand: "Nike",
      rating: 3.5,
      numReviews: 14,
      description: "high quality product",
    },
    {
      name: "Adidas Fit Pant",
      slug: "adidas-fit-pant",
      category: "Pants",
      image: "/images/p4.jpg",
      price: 65,
      countInStock: 5,
      brand: "Puma",
      rating: 2.5,
      numReviews: 10,
      description: "high quality product",
    },
  ],
};

const seedRouter = express.Router();

seedRouter.get("/", async (req: Request, res: Response) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
