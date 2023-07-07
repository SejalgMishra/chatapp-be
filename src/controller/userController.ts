import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class userController {
  static addUser = async (req: Request, res: Response) => {
    try {
      const add = await prisma.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        },
      })
      res.json(add)
      } catch (error) {
      res.json(error);
      console.log(error);
      
    }
  };
}

export default userController;
