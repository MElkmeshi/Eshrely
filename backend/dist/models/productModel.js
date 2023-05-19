"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    countInStock: { type: Number, default: 0, required: true },
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
//# sourceMappingURL=productModel.js.map