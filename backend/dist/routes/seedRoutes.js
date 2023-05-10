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
const data_1 = __importDefault(require("../src/data"));
const userModel_1 = __importDefault(require("../models/userModel"));
const seedRouter = express_1.default.Router();
seedRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany({});
    const createdProducts = yield productModel_1.default.insertMany(data_1.default.products);
    yield userModel_1.default.deleteMany({});
    const createdUsers = yield userModel_1.default.insertMany(data_1.default.users);
    res.send({ createdProducts, createdUsers });
}));
exports.default = seedRouter;
//# sourceMappingURL=seedRoutes.js.map