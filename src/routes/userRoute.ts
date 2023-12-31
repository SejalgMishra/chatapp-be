import userController from "../controller/userController";
import express from "express";
import { UPLOAD_TYPES, UploadSingleFile } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";
import { userValidation } from "../request/userRequest";

const router = express.Router();

router.post(
  "/user",
  UploadSingleFile(UPLOAD_TYPES.IMAGE, "image"),
  userController.addUser
);

router.get("/user", userController.getUser);

router.patch(
  "/update/:id",
  UploadSingleFile(UPLOAD_TYPES.IMAGE, "image"),
  userController.updateUser
);

router.post("/login", userController.CheackUser);


router.get("/serch" , userController.serchUser);


router.delete("/user/:id", userController.deleteUser);

export default router;

