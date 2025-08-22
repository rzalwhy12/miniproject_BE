import { randomBytes } from "crypto";
import { prisma } from "../config/prisma";

// Generate voucher code using crypto
const generateCode = (length: number = 6): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const bytes = randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
};

//funct generate Voucher
export const generateVoucherCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = generateCode();
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code },
    });
    exists = !!existingVoucher;
  } while (exists);

  return code;
};
