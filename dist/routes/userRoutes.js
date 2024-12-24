"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const schemaMiddleware_1 = require("../middleware/schemaMiddleware");
const userSchema_1 = require("../schema/userSchema");
const router = express_1.default.Router();
router.route("/register").post((0, schemaMiddleware_1.validate)(userSchema_1.userRegisterSchema), userController_1.registerUser);
router.route("/login").post((0, schemaMiddleware_1.validate)(userSchema_1.loginSchema), userController_1.loginUser);
router.route("/search").get(userController_1.searchUserWithEmailOrUsername);
exports.default = router;
