import express from "express";
import auth from "../middleware/authMiddleware";
import {
  createConversation,
  getUserConversations,
} from "../controllers/conversationController";

const router = express.Router();

router.route("/").get(auth, getUserConversations);
router.post("/create-chat", auth, createConversation);

export default router;
