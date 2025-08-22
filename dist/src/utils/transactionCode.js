"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionCode = void 0;
const nanoid_1 = require("nanoid");
const prisma_1 = require("../config/prisma");
const nanoid = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);
const generateTransactionCode = async () => {
    let code;
    let exists = true;
    do {
        code = `TRX-${nanoid()}`; // misal hasil: TRX-9F4K2B
        const existingTx = await prisma_1.prisma.transaction.findUnique({
            where: { transactionCode: code },
        });
        exists = !!existingTx;
    } while (exists);
    return code;
};
exports.generateTransactionCode = generateTransactionCode;
