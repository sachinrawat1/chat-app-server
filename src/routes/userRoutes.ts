import express from "express";
import {
  loginUser,
  registerUser,
  searchUserWithEmailOrUsername,
} from "../controllers/userController";
import { validate } from "../middleware/schemaMiddleware";
import { loginSchema, userRegisterSchema } from "../schema/userSchema";

const router = express.Router();

router.route("/register").post(validate(userRegisterSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/search").get(searchUserWithEmailOrUsername);

export default router;
