import { nanoid } from 'nanoid';
import { prisma } from "../config/prisma";

const generateCustomId = () => nanoid(8).toUpperCase();

//funct generate referal
export const generateReferralCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = generateCustomId();
    const existingUser = await prisma.user.findUnique({
      where: { referralCode: code },
    });
    exists = !!existingUser;
  } while (exists);

  return code;
};
