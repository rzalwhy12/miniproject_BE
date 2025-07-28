import { sign, SignOptions } from "jsonwebtoken";
import { Role } from "../../prisma/generated/client";

interface IObjectToken {
  id: string;
  role: Role;
  isverified: boolean;
}
export const generateToken = (
  objectToken: IObjectToken,
  key: string,
  options: SignOptions = { expiresIn: "1h" } //default expire 7h
): string => {
  return sign(objectToken, key, options);
};
