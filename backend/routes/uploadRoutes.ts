import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/productModel";

const uploadRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/images/");
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const countProducts = await Product.countDocuments();
    cb(null, "p" + countProducts + ext);
  },
});

const upload = multer({ storage: storage });

uploadRouter.post("/", upload.single("file"), (req: Request, res: Response) => {
  res.send({ file: req.file.filename, url: `/images/${req.file.filename}` });
});

export default uploadRouter;
