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

  static recentChat = async (req: Request, res: Response) => {
    const { userId } = req.params
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    try {
      const recentChats: any = await prisma.message.findMany({
        where: {
          userId: objectIdRegex.test(userId) ? userId : undefined,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          receiverData: true,
        },
      });

      const receiverIds = new Set(); // Create a Set to store unique receiverIds

      // Filter recentChats and remove duplicates
      const filteredChats = recentChats.filter((chat: any) => {
        if (chat?.receiverData?.id) {
          if (receiverIds.has(chat.receiverData.id)) {
            return false; // Duplicate receiverId, skip this chat
          } else {
            receiverIds.add(chat.receiverData.id); // Add receiverId to the Set
            return true; // Unique receiverId, include this chat
          }
        }
        return true; // Include chats where receiverData.id is undefined
      });

      const data = filteredChats.reduce((p: any, c: { receiver: any }) => {
        const { receiver } = c;
        p[receiver] = p[receiver] ?? [];
        p[receiver].push(c);
        return p;
      }, {});

      res.send(filteredChats);
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

  static getMessagesByUserIdAndReceiverId = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { receiver } = req.params;
      const { userId } = req.query as any;

      const messages = await prisma.message.findMany({
        where: {
          userId,
          receiver,
        },
      });

      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default MessageController;
