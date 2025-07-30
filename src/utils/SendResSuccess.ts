import { Response } from "express";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";

//funct handler response successs

export const sendResSuccess = <T>(
  res: Response,
  message: SuccessMsg,
  statusCode: StatusCode,
  data?: T,
  token?: string
) => {
  return res.status(statusCode).json({
    result: { success: true, message, data, token },
  });
};
