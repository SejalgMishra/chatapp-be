import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MessageController {

    static createMessage =  async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            
        }

    }
}

export default MessageController