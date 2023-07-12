import messageController from "../controller/messageController";
import express from "express";
import { UPLOAD_TYPES, UploadSingleFile } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/message/:userId", messageController.createMessage);

router.get("/message/:reciver", messageController.reciveMessage);

router.get("/recent/:userId", messageController.recentChat);

router.delete("/recent", messageController.deletechat);

router.get('/message/:receiverId', messageController.getMessagesByUserIdAndReceiverId);

export default router;
