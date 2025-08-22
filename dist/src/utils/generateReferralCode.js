"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = void 0;
const nanoid_1 = require("nanoid");
const prisma_1 = require("../config/prisma");
const generateCustomId = () => (0, nanoid_1.nanoid)(8).toUpperCase();
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
