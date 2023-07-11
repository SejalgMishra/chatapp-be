import messageController from "../controller/messageController";
import express from "express";
import { UPLOAD_TYPES, UploadSingleFile } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/message/:userId", messageController.createMessage);

router.get("/message/:reciver", messageController.reciveMessage);

router.get("/recent", messageController.recentChat);

router.delete("/recent", messageController.deletechat);

export default router;
