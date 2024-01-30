import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import orderRouter from "./routes/orderRoutes";
import uploadRouter from "./routes/uploadRoutes";
import path from "path";
import cors from "cors";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

const dirname = path.join(__dirname, "../", "../");
app.use(express.static(path.join(dirname, "/frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(dirname, "/frontend/dist/index.html"))
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
