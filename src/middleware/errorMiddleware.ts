import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = (err instanceof CustomError && err.statusCode) || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
};

export { errorHandler };
