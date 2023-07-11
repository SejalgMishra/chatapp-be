import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MessageController {
  static createMessage = async (req: Request, res: Response) => {
    const { message, receiver } = req.body;
    const { userId } = req.params;
    try {
      const sendMsg = await prisma.message.create({
        data: {
          message,
          sender: { connect: { id: userId } },
          receiverData: { connect: { id: receiver } },
        },
      });
      res.send(sendMsg);
    } catch (error) {
      console.log(error);
    }
  };

  static reciveMessage = async (req: Request, res: Response) => {
    const { reciver } = req.params;
    const userId = req.body.id;

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    try {
      const getMsg = await prisma.message.findMany({
        where: {
          receiver: objectIdRegex.test(reciver) ? reciver : undefined,
          userId: objectIdRegex.test(userId) ? userId : undefined,
        },
      });

      res.send(getMsg);
    } catch (error) {
      console.log(error);
    }
  };

  static recentChat = async (_req: Request, res: Response) => {
    try {
      const recentChats: any = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          receiverData: true,
        },
      });

      const data = recentChats.reduce((p: any, c: { receiver: any }) => {
        const { receiver } = c;
        p[receiver] = p[receiver] ?? [];
        p[receiver].push(c);
        return p;
      }, {});
      res.send(recentChats);
    } catch (error) {
      console.log(error);
    }
  };

  static deletechat = async (_req: Request, _res: Response) => {
    try {
      const recentChats = await prisma.message.deleteMany();
    } catch (error) {
      console.log(error);
    }
  };
}

export default MessageController;
