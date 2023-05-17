import express, { NextFunction, Request, Response } from "express";
const port = process.env.PORT || 3000;
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "../routes/seedRoutes";
import productRouter from "../routes/productRoutes";
import userRouter from "../routes/userRoutes";
import orderRouter from "../routes/orderRoutes";
import uploadRouter from "../routes/uploadRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log(error.message));

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
