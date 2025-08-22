"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const hash_1 = require("../utils/hash");
class AccountRepository {
    constructor() {
        this.getDataUser = async (id) => {
            return await prisma_1.prisma.user.findUnique({
                where: {
                    id,
                },
            });
        };
        this.updateUser = async (id, dataUser) => {
            return await prisma_1.prisma.user.update({
                where: {
                    id,
                },
                data: { ...dataUser },
            });
        };
        this.getUserCoupon = async (userId) => {
            const referral = await prisma_1.prisma.referral.findUnique({
                where: { referredId: userId },
                include: { coupon: true },
            });
            if (referral?.coupon &&
                referral.coupon.isUsed === false &&
                referral.coupon.usedTemporarily === false &&
                referral.coupon.expiresAt > new Date()) {
                const { discount, expiresAt } = referral.coupon;
                return { discount, expiresAt };
            }
            return null;
        };
        this.getPoint = async (userId) => {
            const result = await prisma_1.prisma.point.aggregate({
                where: {
                    userId,
                    isUsed: false,
                    usedTemporarily: false,
                    expiresAt: { gt: new Date() },
                },
                _sum: { amount: true },
            });
            const soonestPoint = await prisma_1.prisma.point.findFirst({
                where: {
                    userId,
                    isUsed: false,
                    usedTemporarily: false,
                    expiresAt: { gt: new Date() },
                },
                orderBy: {
                    expiresAt: "asc",
                },
                select: {
                    expiresAt: true,
                },
            });
            return {
                totalPoint: result._sum.amount || 0,
                soonestExpiry: soonestPoint?.expiresAt || null,
            };
        };
        this.newPassword = async (userId, newPassword) => {
            return await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { password: await (0, hash_1.hashPassword)(newPassword) },
            });
        };
    }
    async getCoupons(userId) {
        return await prisma_1.prisma.coupon.findMany({
            where: {
                id: userId,
            },
        });
    }
}
exports.default = AccountRepository;
