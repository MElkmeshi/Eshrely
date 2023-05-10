"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 3000;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const seedRoutes_1 = __importDefault(require("../routes/seedRoutes"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("../routes/orderRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.log(error.message));
app.use("/api/seed", seedRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});
app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));
//# sourceMappingURL=app.js.map