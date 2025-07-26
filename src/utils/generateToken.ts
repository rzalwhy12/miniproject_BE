import { sign, SignOptions } from "jsonwebtoken";
import { IObjectToken } from "../types/generateToken.type";

//function generate token
export const generateToken = (
  objectToken: IObjectToken,
  key: string,
  options: SignOptions = { expiresIn: "7d" } //default expire 7d
): string => {
  return sign(objectToken, key, options);
};
