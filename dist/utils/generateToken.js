"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
    const secret = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ userId }, secret, {
        expiresIn: "30d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // Should be true on production
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
};
exports.default = generateToken;
