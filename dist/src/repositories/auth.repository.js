"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
const prisma_1 = require("../config/prisma");
const generateReferralCode_1 = require("../utils/generateReferralCode");
const hash_1 = require("../utils/hash");
//repocitosreies yang berhubungan dengan database
class AuthRepository {
    constructor() {
        this.createUser = async (dataSignUp) => {
            return await prisma_1.prisma.user.create({
                data: {
                    ...dataSignUp,
                    password: await (0, hash_1.hashPassword)(dataSignUp.password),
                    referralCode: await (0, generateReferralCode_1.generateReferralCode)(),
                },
            });
        };
        this.addRole = async (userId) => {
            const roles = await prisma_1.prisma.role.findMany({
                where: {
                    name: { in: [client_1.RoleName.CUSTOMER, client_1.RoleName.ORGANIZER] },
                },
            });
            const customer = roles.find((r) => r.name === client_1.RoleName.CUSTOMER);
            const organizer = roles.find((r) => r.name === client_1.RoleName.ORGANIZER);
            if (!customer || !organizer) {
                throw new Error("Roles not found");
            }
            return await prisma_1.prisma.userRole.createMany({
                data: [
                    { userId, roleId: customer.id, isActive: true },
                    { userId, roleId: organizer.id, isActive: false },
                ],
            });
        };
        this.findAccount = async (dataFindUnique) => {
            const { id, email, username, referral } = dataFindUnique;
            if (email) {
                return await prisma_1.prisma.user.findUnique({
                    where: { email },
                    include: {
                        roles: { include: { role: true } },
                    },
                });
            }
            if (username) {
                return await prisma_1.prisma.user.findUnique({
                    where: { username },
                    include: {
                        roles: { include: { role: true } },
                    },
                });
            }
            if (referral) {
                return await prisma_1.prisma.user.findUnique({
                    where: { referralCode: referral },
                    include: {
                        roles: { include: { role: true } },
                    },
                });
            }
            if (id) {
                return await prisma_1.prisma.user.findUnique({
                    where: { id },
                    include: {
                        roles: { include: { role: true } },
                    },
                });
            }
            return null;
        };
        this.addReferral = async (dataReferal) => {
            return await prisma_1.prisma.referral.create({
                data: {
                    ...dataReferal,
                },
                include: {
                    coupon: true,
                },
            });
        };
        this.addCoupon = async (dataCoupon) => {
            return await prisma_1.prisma.coupon.create({
                data: {
                    ...dataCoupon,
                },
            });
        };
        this.addPoint = async (dataPoint) => {
            return await prisma_1.prisma.point.create({
                data: {
                    ...dataPoint,
                },
            });
        };
        this.updateUser = async (dataUser) => {
            return await prisma_1.prisma.user.update({
                where: {
                    id: dataUser.id,
                },
                data: { ...dataUser },
            });
        };
        this.resetPassword = async (id, password) => {
            return await prisma_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    password: await (0, hash_1.hashPassword)(password),
                },
            });
        };
        this.switchRoleRepo = async (userId, targetRoleId) => {
            // 1. Set semua role user jadi tidak aktif
            await prisma_1.prisma.userRole.updateMany({
                where: { userId },
                data: { isActive: false },
            });
            // 2. Aktifkan role yang dipilih
            await prisma_1.prisma.userRole.updateMany({
                where: { userId, roleId: targetRoleId },
                data: { isActive: true },
            });
            // 3. Ambil role aktif
            const activeRole = await prisma_1.prisma.userRole.findFirst({
                where: { userId, isActive: true },
                include: { role: true },
            });
            // 4. Return hanya nama role
            return activeRole?.role.name;
        };
        this.activeRole = async (userId) => {
            const active = await prisma_1.prisma.userRole.findFirst({
                where: { userId, isActive: true },
                include: { role: true },
            });
            return active?.role.name;
        };
    }
}
exports.default = AuthRepository;
