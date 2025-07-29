import { sign, SignOptions } from "jsonwebtoken";
import { RoleName } from "../../prisma/generated/client";

interface IObjectToken {
  id: string;
  email: string;
  isverified: boolean;
  activeRole: RoleName;
}
export const generateToken = (
  objectToken: IObjectToken,
  key: string,
  options: SignOptions = { expiresIn: "1h" } //default expire 1h
): string => {
  return sign(objectToken, key, options);
};
