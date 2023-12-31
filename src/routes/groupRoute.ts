import groupController from "../controller/groupController";
import express from "express";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/group" ,authMiddleware ,  groupController.createGroup)

router.get("/group/:userId" ,   groupController.getGroup)

router.get("/:id" ,   groupController.getGroupDetails)

router.post("/message" ,authMiddleware , groupController.createMessageForGroup)

router.get("/msg/:groupId"  , groupController.groupChat)



export default router;
