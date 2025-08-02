import { customAlphabet } from "nanoid";
import { prisma } from "../config/prisma";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export const generateTransactionCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = `TRX-${nanoid()}`; // misal hasil: TRX-9F4K2B
    const existingTx = await prisma.transaction.findUnique({
      where: { transactionCode: code },
    });
    exists = !!existingTx;
  } while (exists);

  return code;
};
