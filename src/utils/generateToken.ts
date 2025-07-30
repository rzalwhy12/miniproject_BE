import { sign } from "jsonwebtoken";
import { RoleName } from "../../prisma/generated/client";

type TimeUnit = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;
interface IObjectToken {
  id: number;
  email: string;
  isverified: boolean;
  activeRole: RoleName;
}
export const generateToken = (
  objectToken: IObjectToken,
  expiresIn: TimeUnit = "1h"
) => {
  if (!process.env.TOKEN_KEY) return null;

  return sign(objectToken, process.env.TOKEN_KEY, { expiresIn });
};
