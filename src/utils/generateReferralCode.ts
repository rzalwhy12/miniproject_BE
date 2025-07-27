import { customAlphabet } from "nanoid";
import { prisma } from "../config/prisma";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

//funct generate referal
export const generateReferralCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = nanoid();
    const existingUser = await prisma.user.findUnique({
      where: { referralCode: code },
    });
    exists = !!existingUser; //double negation mengubah nilai apaun yang bernilai falsy false dan truthy true
  } while (exists);

  return code;
};
