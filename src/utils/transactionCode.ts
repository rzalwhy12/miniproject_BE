import { randomBytes } from "crypto";
import { prisma } from "../config/prisma";

// Generate transaction code using crypto
const generateCode = (length: number = 6): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const bytes = randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
};

export const generateTransactionCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = `TRX-${generateCode()}`; // misal hasil: TRX-9F4K2B
    const existingTx = await prisma.transaction.findUnique({
      where: { transactionCode: code },
    });
    exists = !!existingTx;
  } while (exists);

  return code;
};
