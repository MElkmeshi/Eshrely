"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(user) {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}
exports.generateToken = generateToken;
const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: "Invalid Token" });
            }
            else {
                req.body.user = decode;
                next();
            }
        });
    }
    else {
        res.status(401).send({ message: "No Token" });
    }
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => {
    if (req.body.user && req.body.user.isAdmin) {
        next();
    }
    else {
        res.status(401).send({ message: "Invalid Admin Token" });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=utils.js.map