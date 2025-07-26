import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
