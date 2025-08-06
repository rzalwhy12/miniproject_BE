import { prisma } from "../config/prisma";

class VoucherRepository {
    public async applyVoucher(eventId: number, voucherCode: string) {
        const voucher = await prisma.voucher.findFirst({
            where: {
                eventId,
                code: voucherCode,
                status: "ACTIVE",
            },
        });
        return voucher;
    }

    public async getVouchers(eventId?: number) {
        return await prisma.voucher.findMany({
            where: eventId ? { eventId } : undefined,
        });
    }

    public async getVouchersByEventId(eventId: number) {
        return await prisma.voucher.findMany({
            where: { eventId },
        });
    }
}
export default new VoucherRepository();
