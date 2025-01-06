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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserWithEmailOrUsername = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const asyncHandlerMiddleware_1 = __importDefault(require("../middleware/asyncHandlerMiddleware"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const customError_1 = require("../utils/customError");
exports.registerUser = (0, asyncHandlerMiddleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const existing_user = yield prismaClient_1.default.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });
    if (existing_user) {
        const duplicateField = existing_user.username === username ? "username" : "email";
        throw new customError_1.CustomError(`User with this ${duplicateField} already exists`, 400);
    }
    const hashed_password = yield bcrypt_1.default.hash(password, 10);
    const new_user = yield prismaClient_1.default.user.create({
        data: {
            username,
            email,
            password: hashed_password,
        },
    });
    return res.status(201).send({
        success: true,
        message: "user registered successfully",
        data: {
            id: new_user.id,
            username: new_user.username,
            email: new_user.email,
        },
    });
}));
exports.loginUser = (0, asyncHandlerMiddleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailOrUsername, password } = req.body;
    const existUser = yield prismaClient_1.default.user.findFirst({
        where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
    });
    if (!existUser) {
        throw new customError_1.CustomError(`User with ${emailOrUsername} doesn't exists`, 400);
    }
    const match_password = yield bcrypt_1.default.compare(password, existUser.password);
    if (!match_password) {
        throw new customError_1.CustomError(`Wrong email/username or password`, 400);
    }
    const token = (0, generateToken_1.default)(res, existUser.id);
    const { password: _ } = existUser, userDetails = __rest(existUser, ["password"]);
    return res.status(200).send({
        status: true,
        message: "login successfully",
        data: userDetails,
        token,
    });
}));
exports.searchUserWithEmailOrUsername = (0, asyncHandlerMiddleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const users = yield prismaClient_1.default.user.findMany({
        where: {
            OR: [
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    username: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        },
        select: {
            id: true,
            username: true,
            email: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return res.status(200).send({
        success: true,
        message: users.length > 0 ? "Users found" : "Users not found",
        data: users,
    });
}));
