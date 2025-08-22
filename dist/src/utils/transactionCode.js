"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionCode = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../config/prisma");
// Generate transaction code using crypto
const generateCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const bytes = (0, crypto_1.randomBytes)(length);
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
};
const generateTransactionCode = async () => {
    let code;
    let exists = true;
    do {
        code = `TRX-${generateCode()}`; // misal hasil: TRX-9F4K2B
        const existingTx = await prisma_1.prisma.transaction.findUnique({
            where: { transactionCode: code },
        });
        exists = !!existingTx;
    } while (exists);
    return code;
};
exports.generateTransactionCode = generateTransactionCode;
