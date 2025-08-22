"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoucherCode = void 0;
const nanoid_1 = require("nanoid");
const prisma_1 = require("../config/prisma");
const nanoid = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
//funct generate Voucher
const generateVoucherCode = async () => {
    let code;
    let exists = true;
    do {
        code = nanoid();
        const existingVoucher = await prisma_1.prisma.voucher.findUnique({
            where: { code },
        });
        exists = !!existingVoucher;
    } while (exists);
    return code;
};
exports.generateVoucherCode = generateVoucherCode;
