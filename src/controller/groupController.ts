import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class GroupController {
  static createGroup = async (req: Request, res: Response) => {
    const users = req.body.users; // Array of user IDs
    const userId = req.body.id;

    try {
      const group = await prisma.group.create({
        data: {
          users: {
            connect: users.map((userId: string) => ({ id: userId })), // Connect multiple user IDs
          },
          userId: userId,
          name: req.body.name,
          description: req.body.description,
        },
      });
      res.send(group);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

  static getGroup = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const findGroup = await prisma.group.findMany({
        where: {
          userId: {
            has: userId,
          },
        },
        include: {
          users: true,
        },
      });
      res.send(findGroup);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };

  static getGroupDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const details = await prisma.group.findFirst({
        where: { id },
        include: {
          users: true,
        },
      }); 
      res.send(details);
    } catch (error) {
      console.log(error);
    }
  };

  static createMessageForGroup = async (req: Request, res: Response) => {
    const { message, groupId } = req.body;
    const userId = req.body.id;

    const find = await prisma.group.findMany({
      where: { id: groupId },
    });

    if (find.length === 0) {
      return res.status(500).send("This group id isnot exists");
    }

    try {
      const createdMessage = await prisma.message.create({
        data: {
          message,
          type: "GROUP",
          sender: { connect: { id: userId } },
          group: { connect: { id: groupId } },
        },
        include: {
          sender: true,
          group: true,
        },
      });

      res.json(createdMessage);
    } catch (error) {
      console.log(error);
    }
  };

  static groupChat = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    try {
      const findChats = await prisma.message.findMany({
        where: { groupId: objectIdRegex.test(groupId) ? groupId : undefined, type : "GROUP" },
        include: { sender: true, receiverData: true },
      });
      res.json(findChats);
    } catch (error) {
      console.log(error);
    }
  };
}

export default GroupController;
