import { Response } from "express";
import { SuccessMsg } from "../constants/successMessage.enum";

//function handler response successs
export const successRes = <T>(
  res: Response,
  message: SuccessMsg,
  statusCode: number,
  data?: T
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
