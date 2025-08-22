"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoucherCode = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../config/prisma");
// Generate voucher code using crypto
const generateCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const bytes = (0, crypto_1.randomBytes)(length);
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
};
//funct generate Voucher
const generateVoucherCode = async () => {
    let code;
    let exists = true;
    do {
        code = generateCode();
        const existingVoucher = await prisma_1.prisma.voucher.findUnique({
            where: { code },
        });
        exists = !!existingVoucher;
    } while (exists);
    return code;
};
exports.generateVoucherCode = generateVoucherCode;
