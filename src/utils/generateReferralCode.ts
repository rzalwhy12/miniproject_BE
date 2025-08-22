import { randomBytes } from 'crypto';
import { prisma } from "../config/prisma";

const generateCustomId = () => {
  return randomBytes(4).toString('hex').toUpperCase();
};

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
