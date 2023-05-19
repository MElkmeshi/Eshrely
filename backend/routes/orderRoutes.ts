import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import { isAdmin, isAuth } from "../utils";
import User from "../models/userModel";
import Product from "../models/productModel";

const orderRouter = express.Router();

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate("user", "name");
    res.send(orders);
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.body.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({ user: req.body.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
orderRouter.put(
  "/:id/pay",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      res.send({ message: "Order Paid" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
