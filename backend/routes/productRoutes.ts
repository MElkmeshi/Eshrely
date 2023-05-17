import express, { Request, Response } from "express";
import Product from "../models/productModel";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils";

const productRouter = express.Router();

productRouter.get("/", async (req: express.Request, res: express.Response) => {
  const products = await Product.find({});
  res.send(products);
});

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const newProduct = new Product({
      name: "sample name " + Date.now(),
      slug: "sample-name-" + Date.now(),
      image: "/images/p1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = Number(req.body.countInStock);
      product.description = req.body.description;
      await product.save();
      res.send({ message: "Product Updated" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

const PAGE_SIZE = 3;
productRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { query } = req;
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const uniqueCategories = await Product.find({}).distinct("category");
    res.send(uniqueCategories);
  })
);

type SortOrder = 1 | -1;

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(String(price).split("-")[0]),
              $lte: Number(String(price).split("-")[1]),
            },
          }
        : {};
    const sortOrder: { [key: string]: SortOrder } =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(Number(pageSize) * (Number(page) - 1))
      .limit(Number(pageSize));
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    //const thepage = Number(page);
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / Number(pageSize)),
    });
  })
);

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
