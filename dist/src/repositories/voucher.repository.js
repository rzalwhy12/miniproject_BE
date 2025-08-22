"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class VoucherRepository {
    async applyVoucher(eventId, voucherCode) {
        const voucher = await prisma_1.prisma.voucher.findFirst({
            where: {
                eventId,
                code: voucherCode,
                status: "ACTIVE",
            },
        });
        return voucher;
    }
    async getVouchers(eventId) {
        return await prisma_1.prisma.voucher.findMany({
            where: eventId ? { eventId } : undefined,
        });
    }
    async getVouchersByEventId(eventId) {
        return await prisma_1.prisma.voucher.findMany({
            where: { eventId },
        });
    }
}
exports.default = new VoucherRepository();
