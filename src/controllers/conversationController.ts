import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandlerMiddleware";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../prismaClient";
import { CustomError } from "../utils/customError";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const createConversation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId as number;
      const chatUserId = parseInt(req.body.chatUserId);
      const conversationType = req.body.conversationType;

      console.log(userId, typeof userId, typeof chatUserId);

      const exisitingChat = await prisma.conversations.findFirst({
        where: {
          type: conversationType,
          UserConversation: {
            every: {
              OR: [{ userId: userId }, { userId: chatUserId }],
            },
          },
        },
      });

      if (exisitingChat) {
        return res.status(200).json({
          success: true,
          message: "Conversation already exists.",
          conversation: exisitingChat,
        });
      }

      const newChat = await prisma.conversations.create({
        data: {
          type: conversationType || "private",
          UserConversation: {
            create: [{ userId: userId }, { userId: chatUserId }],
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Conversation started successfully.",
        conversation: newChat,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const getUserConversations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.userId;

      const userConversation = await prisma.conversations.findMany({
        where: {
          UserConversation: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              image: true,
            },
          },
          Messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              content: true,
              senderId: true,
              createdAt: true,
            },
          },
        },
      });

      return res.status(200).send({
        success: true,
        message:
          userConversation.length > 0
            ? "Conversation fetched successfully"
            : "No conversations found",
        data: userConversation,
      });
    } catch (error: any) {
      throw new CustomError(error.message, 500);
    }
  }
);
