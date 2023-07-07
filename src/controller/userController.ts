import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class userController {
  static addUser = async (req: Request, res: Response) => {
    const { username, password, email, image } = req.body;

    const findEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (findEmail) {
      res.status(500).send({ msg: "this email already exsits" });
      return;
    }

    const findUsername = await prisma.user.findFirst({
      where: { username: username },
    });
    if (findUsername) {
      return res.status(500).send({ msg: "this username already exsits" });
    }

    try {
      const myHashPass = await bcrypt.hash(password, 10);

      const add = await prisma.user.create({
        data: {
          username,
          email,
          password: myHashPass,
          image: req.url,
        },
      });

      const response = {
        id: add.id,
        username: add.username,
        email: add.email,
        image: add.image,
      };

      const token = jwt.sign({ id: add.id, username: add.username }, "1234");
      res.json({ response, token });
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const get = await prisma.user.findMany();
      res.json(get);
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id: id } });
      res.json({ msg: `user deleted with id of ${id}` });
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };

  static serchUser = async (req: Request, res: Response) => {
    const { username } = req.query;

    try {
      const get = await prisma.user.findMany({
        where: {
          username: {
            contains: username as any,
          },
        },
      });
      res.json(get);
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username , email } = req.body;
    try {
      const update = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: username,
          image: req.url,
          email: email,
        },
      });
      res.json(update);
    } catch (error) {
      res.json(error);
      console.log(error);
    }
  };
}

export default userController;
