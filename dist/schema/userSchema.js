"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userRegisterSchema = void 0;
const zod_1 = require("zod");
exports.userRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        username: zod_1.z
            .string()
            .min(3, { message: "Username must be at least 3 characters long" })
            .max(30, { message: "Username must not exceed 30 characters" }),
        password: zod_1.z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
            .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
            .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
            .regex(/[\W_]/, {
            message: "Password must contain at least one special character",
        }),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        emailOrUsername: zod_1.z.string().min(3, "username must be 3 characters long"),
        password: zod_1.z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
            .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
            .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
            .regex(/[\W_]/, {
            message: "Password must contain at least one special character",
        }),
    }),
});
