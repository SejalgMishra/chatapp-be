import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

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
    const { userId } = req.params;
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    try {
      const recentChats: any = await prisma.message.findMany({
        where: {
          OR: [
            { userId: objectIdRegex.test(userId) ? userId : undefined },
            { receiver: objectIdRegex.test(userId) ? userId : undefined },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          receiverData: true,
        },
      });

      const receiverIds = new Set();
      const filteredChats = [];

      for (const chat of recentChats) {
        const receiverId = chat?.receiverData?.id;

        if (receiverId && !receiverIds.has(receiverId)) {
          filteredChats.push(chat);
          receiverIds.add(receiverId);
        }
      }

      const data = filteredChats.reduce((p: any, c: any) => {
        const { receiver } = c;
        p[receiver] = p[receiver] ?? [];
        p[receiver].push(c);
        return p;
      }, {});

      res.send({ filteredChats, receiverIds });
    } catch (error) {
      console.log(error);
    }
  };

  static deletechat = async (req: Request, res: Response) => {
    try {
      const recentChats = await prisma.message.deleteMany();
      res.send("deletd");
    } catch (error) {
      console.log(error);
    }
  };

  static getMessagesByUserIdAndReceiverId = async (
    req: Request,
    res: Response
  ) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    try {
      const { receiver } = req.params;
      const { userId } = req.query as any;

      const messages = await prisma.message.findMany({
        where: {
          receiver: objectIdRegex.test(receiver) ? receiver : undefined,
          userId: objectIdRegex.test(userId) ? userId : undefined,
        },
      });

      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static clearChat = async (req: Request, res: Response) => {
    const userId = req.body.id;
    console.log(userId);
    
    const { receiver } = req.params;
    console.log(receiver);
    
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    try {
      const deleteMessage = await prisma.message.deleteMany({
        where: {
          OR: [
            {
              receiver: objectIdRegex.test(receiver) ? receiver : undefined ,
              userId: objectIdRegex.test(userId) ? userId : undefined,
            },
            {
              receiver: objectIdRegex.test(userId) ? userId : undefined ,
              userId: objectIdRegex.test(receiver) ? receiver : undefined,
            }
          ]
         
        },
      });
      res.send(`${userId} deleted the chat`)
      console.log(deleteMessage);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

// static clearChat = async (req: Request, res: Response) => {
//   const userId = req.body.id;
//   const { receiver } = req.params;

//   const objectIdRegex = /^[0-9a-fA-F]{24}$/;
//   try {
//     const updatedMessages = await prisma.message.updateMany({
//       where: {
//         userId: objectIdRegex.test(userId) ? userId : undefined,
//         receiver: objectIdRegex.test(receiver) ? receiver : undefined,
//         deleted: false, // Only update messages that are not already deleted
//       },
//       data: {
//         deleted: true, // Mark the messages as deleted
//       },
//     });

//     res.send(`${userId} cleared the chat with ${receiver}`);
//     console.log(updatedMessages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

}

export default MessageController;
