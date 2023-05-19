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
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data = {
    users: [
        {
            name: "Mohamed Elkmeshi",
            email: "elkmeshi2002@gmail.com",
            password: bcryptjs_1.default.hashSync("MohElk13241?"),
            isAdmin: true,
        },
        {
            name: "Naeem Allwati",
            email: "nallwati@redtech.ly",
            password: bcryptjs_1.default.hashSync("1234"),
            isAdmin: true,
        },
    ],
    products: [
        {
            name: "Nike Slim shirt",
            slug: "nike-slim-shirt",
            category: "Shirts",
            image: "/images/p1.jpg",
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
const seedRouter = express_1.default.Router();
seedRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany({});
    const createdProducts = yield productModel_1.default.insertMany(data.products);
    yield userModel_1.default.deleteMany({});
    const createdUsers = yield userModel_1.default.insertMany(data.users);
    res.send({ createdProducts, createdUsers });
}));
exports.default = seedRouter;
//# sourceMappingURL=seedRoutes.js.map