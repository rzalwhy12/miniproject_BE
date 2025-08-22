"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_repository_1 = __importDefault(require("../repositories/voucher.repository"));
class VoucherService {
    async applyVoucher(eventId, voucherCode) {
        const voucher = await voucher_repository_1.default.applyVoucher(eventId, voucherCode);
        if (!voucher)
            return { discount: 0 };
        return { discount: voucher.discount };
    }
    async getVouchers(eventId) {
        return await voucher_repository_1.default.getVouchers(eventId);
    }
    async getVouchersByEventId(eventId) {
        return await voucher_repository_1.default.getVouchersByEventId(eventId);
    }
}
exports.default = new VoucherService();
