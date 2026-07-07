import { Router } from "express";
import {
  getConversation,
  sendMessage,
  myConversations,
} from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, myConversations);
router.get("/:matchId", protect, getConversation);
router.post("/", protect, sendMessage);

export default router;
