import userController from "../controller/userController";
import express from "express";
import { UPLOAD_TYPES, UploadSingleFile } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post(
  "/user",
  UploadSingleFile(UPLOAD_TYPES.IMAGE, "image"),
  userController.addUser
);

router.get("/user", userController.getUser);

router.get("/serch",authMiddleware , userController.serchUser);


router.delete("/user/:id", userController.deleteUser);

export default router;