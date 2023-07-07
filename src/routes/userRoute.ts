import userController from "../controller/userController"
import express from "express"

const router = express.Router()

router.post("/user" , userController.addUser)





export default router;
