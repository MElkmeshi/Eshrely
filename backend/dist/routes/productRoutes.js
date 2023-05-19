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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const utils_1 = require("../utils");
const productRouter = express_1.default.Router();
productRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({});
    res.send(products);
}));
productRouter.post("/", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = new productModel_1.default({
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
    const product = yield newProduct.save();
    res.send({ message: "Product Created", product });
})));
productRouter.put("/:id", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield productModel_1.default.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.images = req.body.images;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = Number(req.body.countInStock);
        product.description = req.body.description;
        yield product.save();
        res.send({ message: "Product Updated" });
    }
    else {
        res.status(404).send({ message: "Product Not Found" });
    }
})));
productRouter.delete("/:id", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.id);
    if (product) {
        yield product.deleteOne();
        res.send({ message: "Product Deleted" });
    }
    else {
        res.status(404).send({ message: "Product Not Found" });
    }
})));
const PAGE_SIZE = 3;
productRouter.get("/admin", utils_1.isAuth, utils_1.isAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || PAGE_SIZE;
    const products = yield productModel_1.default.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    const countProducts = yield productModel_1.default.countDocuments();
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
})));
productRouter.get("/categories", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueCategories = yield productModel_1.default.find({}).distinct("category");
    res.send(uniqueCategories);
})));
productRouter.get("/search", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";
    const queryFilter = searchQuery && searchQuery !== "all"
        ? {
            name: {
                $regex: searchQuery,
                $options: "i",
            },
        }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter = rating && rating !== "all"
        ? {
            rating: {
                $gte: Number(rating),
            },
        }
        : {};
    const priceFilter = price && price !== "all"
        ? {
            // 1-50
            price: {
                $gte: Number(String(price).split("-")[0]),
                $lte: Number(String(price).split("-")[1]),
            },
        }
        : {};
    const sortOrder = order === "featured"
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
    const products = yield productModel_1.default.find(Object.assign(Object.assign(Object.assign(Object.assign({}, queryFilter), categoryFilter), priceFilter), ratingFilter))
        .sort(sortOrder)
        .skip(Number(pageSize) * (Number(page) - 1))
        .limit(Number(pageSize));
    const countProducts = yield productModel_1.default.countDocuments(Object.assign(Object.assign(Object.assign(Object.assign({}, queryFilter), categoryFilter), priceFilter), ratingFilter));
    //const thepage = Number(page);
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / Number(pageSize)),
    });
})));
productRouter.get("/slug/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findOne({ slug: req.params.slug });
        if (product) {
            res.send(product);
        }
        else {
            res.status(404).send({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred while fetching the product." });
    }
}));
productRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id);
        if (product) {
            res.send(product);
        }
        else {
            res.status(404).send({ message: "Product Not Found" });
        }
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred while fetching the product." });
    }
}));
exports.default = productRouter;
//# sourceMappingURL=productRoutes.js.map