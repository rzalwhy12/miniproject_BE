import { Response } from "express";
import { SuccessMsg } from "../constants/successMessage.enum";
import { IUserDTO } from "../dto/user/userResponse.dto";
import { StatusCode } from "../constants/statusCode.enum";
import { Result } from "express-validator";

//class handler response successs

class SendResSuccess {
  public generalMessage = (
    res: Response,
    message: SuccessMsg,
    statusCode: StatusCode
  ) => {
    return res.status(statusCode).json({
      result: { success: true, message },
    });
  };

  public sendDataUser = (
    res: Response,
    message: SuccessMsg,
    statusCode: StatusCode,
    data: IUserDTO
  ) => {
    return res.status(statusCode).json({
      result: { success: true, message, data },
    });
  };
}

export default SendResSuccess;
