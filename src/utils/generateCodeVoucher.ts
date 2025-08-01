import { customAlphabet } from "nanoid";
import { prisma } from "../config/prisma";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

//funct generate Voucher
export const generateVoucherCode = async () => {
  let code: string;
  let exists = true;

  do {
    code = nanoid();
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code },
    });
    exists = !!existingVoucher;
  } while (exists);

  return code;
};
