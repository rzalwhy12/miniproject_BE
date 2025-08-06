import voucherRepository from "../repositories/voucher.repository";

class VoucherService {
    public async applyVoucher(eventId: number, voucherCode: string) {
        const voucher = await voucherRepository.applyVoucher(eventId, voucherCode);
        if (!voucher) return { discount: 0 };
        return { discount: voucher.discount };
    }

    public async getVouchers(eventId?: number) {
        return await voucherRepository.getVouchers(eventId);
    }

    public async getVouchersByEventId(eventId: number) {
        return await voucherRepository.getVouchersByEventId(eventId);
    }
}

export default new VoucherService();
