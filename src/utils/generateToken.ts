import { sign } from "jsonwebtoken";
import { RoleName } from "../../prisma/generated/client";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";

type TimeUnit = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;
interface IObjectToken {
  id: number;
  email: string;
  isverified: boolean;
  activeRole?: RoleName;
  rememberMe: boolean;
}
export const generateToken = (
  objectToken: IObjectToken,
  expiresIn: TimeUnit = "1y"
) => {
  if (!process.env.TOKEN_KEY) {
    throw new AppError(
      ErrorMsg.SERVER_MISSING_SECRET_KEY,
      StatusCode.INTERNAL_SERVER_ERROR
    );
  }
  return sign(objectToken, process.env.TOKEN_KEY, { expiresIn });
};
