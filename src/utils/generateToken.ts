import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: number): string => {
  const secret: string = process.env.JWT_SECRET as string;

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // Should be true on production
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return token;
};

export default generateToken;
