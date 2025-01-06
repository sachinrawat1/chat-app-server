import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "../middleware/asyncHandlerMiddleware";
import prisma from "../prismaClient";
import generateToken from "../utils/generateToken";
import { CustomError } from "../utils/customError";

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, email, password } = req.body;

    const existing_user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing_user) {
      const duplicateField =
        existing_user.username === username ? "username" : "email";
      throw new CustomError(
        `User with this ${duplicateField} already exists`,
        400
      );
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const new_user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed_password,
      },
    });

    return res.status(201).send({
      success: true,
      message: "user registered successfully",
      data: {
        id: new_user.id,
        username: new_user.username,
        email: new_user.email,
      },
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { emailOrUsername, password } = req.body;

    const existUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!existUser) {
      throw new CustomError(`User with ${emailOrUsername} doesn't exists`, 400);
    }
    const match_password = await bcrypt.compare(password, existUser.password);
    if (!match_password) {
      throw new CustomError(`Wrong email/username or password`, 400);
    }

    const token = generateToken(res, existUser.id);
    const { password: _, ...userDetails } = existUser;
    return res.status(200).send({
      status: true,
      message: "login successfully",
      data: userDetails,
      token,
    });
  }
);

export const searchUserWithEmailOrUsername = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { search } = req.query;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).send({
      success: true,
      message: users.length > 0 ? "Users found" : "Users not found",
      data: users,
    });
  }
);
