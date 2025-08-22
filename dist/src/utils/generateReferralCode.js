"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../config/prisma");
const generateCustomId = () => {
    return (0, crypto_1.randomBytes)(4).toString('hex').toUpperCase();
};
//funct generate referal
const generateReferralCode = async () => {
    let code;
    let exists = true;
    do {
        code = generateCustomId();
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { referralCode: code },
        });
        exists = !!existingUser;
    } while (exists);
    return code;
};
exports.generateReferralCode = generateReferralCode;
