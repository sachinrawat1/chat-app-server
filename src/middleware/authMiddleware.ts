import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../utils/customError";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; // Add `user` to the Request type
}

const JWT_SECRET = process.env.JWT_SECRET as string;

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new CustomError("Unauthorized: Token not provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    throw new CustomError("Forbidden: Invalid token", 403);
  }
};

export default auth;
