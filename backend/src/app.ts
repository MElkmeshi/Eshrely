import express from "express";
const app = express();
const port = process.env.PORT || 3000;
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "../routes/seedRoutes";
import productRouter from "../routes/productRoutes";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log(error.message));

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
