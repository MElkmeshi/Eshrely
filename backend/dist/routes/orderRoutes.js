"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const utils_1 = require("../utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderRouter = express_1.default.Router();
orderRouter.delete("/:id", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        yield order.deleteOne();
        res.send({ message: "Order Deleted" });
    }
    else {
        res.status(404).send({ message: "Order Not Found" });
    }
})));
orderRouter.get("/", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({}).populate("user", "name");
    res.send(orders);
})));
orderRouter.get("/summary", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: "$totalPrice" },
            },
        },
    ]);
    const users = yield userModel_1.default.aggregate([
        {
            $group: {
                _id: null,
                numUsers: { $sum: 1 },
            },
        },
    ]);
    const dailyOrders = yield orderModel_1.default.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                orders: { $sum: 1 },
                sales: { $sum: "$totalPrice" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const productCategories = yield productModel_1.default.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
})));
orderRouter.post("/", utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = new orderModel_1.default({
        orderItems: req.body.orderItems.map((x) => (Object.assign(Object.assign({}, x), { product: x._id }))),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.body.user._id,
    });
    const order = yield newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
})));
orderRouter.get("/mine", utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({ user: req.body.user._id });
    res.send(orders);
})));
orderRouter.get("/:id", utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        res.send(order);
    }
    else {
        res.status(404).send({ message: "Order Not Found" });
    }
})));
orderRouter.put("/:id/pay", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        yield order.save();
        res.send({ message: "Order Paid" });
    }
    else {
        res.status(404).send({ message: "Order Not Found" });
    }
})));
orderRouter.put("/:id/deliver", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        yield order.save();
        res.send({ message: "Order Delivered" });
    }
    else {
        res.status(404).send({ message: "Order Not Found" });
    }
})));
exports.default = orderRouter;
//# sourceMappingURL=orderRoutes.js.map