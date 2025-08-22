"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_repository_1 = __importDefault(require("../repositories/transaction.repository"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const statusCode_enum_1 = require("../constants/statusCode.enum");
const client_1 = require("../../prisma/generated/client");
const sendEmail_1 = require("../utils/sendEmail");
const sendTicket_template_1 = require("../template/sendTicket.template");
const sendTicketReject_template_1 = require("../template/sendTicketReject.template");
class TransactionService {
    constructor() {
        this.fetchTransactionsByUserId = async (userId) => {
            return await this.transactionRepository.getTransactionsByUserId(userId);
        };
        this.getTransactionByCode = async (transactionCode) => {
            return await this.transactionRepository.getTransactionByCode(transactionCode);
        };
        this.transactionRepository = new transaction_repository_1.default();
        //status awal waiting payment
        this.createTransaction = async (customerId, data) => {
            const { useCoupon, usePoint, voucherCode, eventId } = data;
            // Ambil semua harga tiket
            const ticketPrice = await this.transactionRepository.getTicketPrice(data);
            const totalPrice = ticketPrice.reduce((total, item) => total + item.subTotal, 0);
            // Cek status event
            const isPublished = await this.transactionRepository.isPublished(eventId);
            if (!isPublished) {
                throw new AppError_1.default("Event belum dipublish", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            // Step 1: Validasi voucher
            let voucherDiscount;
            if (voucherCode) {
                const voucher = await this.transactionRepository.validVoucher(voucherCode);
                if (!voucher)
                    throw new AppError_1.default("Voucher tidak ditemukan", statusCode_enum_1.StatusCode.BAD_REQUEST);
                const now = new Date();
                if (now < voucher.startDate)
                    throw new AppError_1.default("Voucher belum aktif", statusCode_enum_1.StatusCode.BAD_REQUEST);
                if (now > voucher.endDate)
                    throw new AppError_1.default("Voucher sudah kedaluwarsa", statusCode_enum_1.StatusCode.BAD_REQUEST);
                voucherDiscount = voucher.discount;
            }
            let coupon;
            if (useCoupon) {
                const findCoupon = await this.transactionRepository.findCoupon(customerId);
                if (!findCoupon?.coupon?.id) {
                    throw new AppError_1.default("Cannot find your coupon", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                if (findCoupon.coupon.expiresAt < new Date()) {
                    throw new AppError_1.default("Coupon has expired", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                if (findCoupon.coupon.usedTemporarily || findCoupon.coupon.isUsed) {
                    throw new AppError_1.default("Coupon is already used or in process", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const updateTemp = await this.transactionRepository.updateCoupenTempt(findCoupon.coupon.id);
                coupon = updateTemp.discount;
            }
            let point = 0;
            if (usePoint) {
                const availablePoints = await this.transactionRepository.findPoint(customerId);
                if (!availablePoints.length) {
                    throw new AppError_1.default("Tidak ada poin yang tersedia", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                await this.transactionRepository.updatePointTempt(customerId);
                point = availablePoints.reduce((total, item) => total + item.amount, 0);
            }
            let finalPrice = totalPrice;
            if (voucherDiscount) {
                const voucherAmount = (finalPrice * voucherDiscount) / 100;
                finalPrice -= voucherAmount;
            }
            if (coupon) {
                const couponAmount = (finalPrice * coupon) / 100;
                finalPrice -= couponAmount;
            }
            if (point > finalPrice) {
                point = finalPrice; //cegah negatif
            }
            finalPrice -= point;
            //final check
            if (finalPrice < 0) {
                finalPrice = 0;
            }
            //simpan transaksi
            const transaction = await this.transactionRepository.createTransaction(customerId, data, useCoupon, usePoint, ticketPrice, finalPrice);
            return transaction;
        };
        //status jadi waiting confirm
        this.uploadProofPayment = async (transactionId, proofImage, customerId) => {
            const transaction = await this.transactionRepository.findTransaction(transactionId);
            if (!transaction) {
                throw new AppError_1.default("Transaction not Found", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            if (new Date(transaction.expiredAt) < new Date()) {
                await this.transactionRepository.updateStatus(transactionId, client_1.TransactionStatus.EXPIRED);
                throw new AppError_1.default("Transaction already expired", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            if (transaction.customerId !== customerId) {
                throw new AppError_1.default("Yout not the owner Of this trasaction", statusCode_enum_1.StatusCode.UNAUTHORIZED);
            }
            const uploadedProof = await this.transactionRepository.uploadPaymentProof(transaction.id, proofImage);
            return uploadedProof;
        };
        //reject atau done
        this.organizerResponse = async (status, transactionId, organizerId) => {
            const findTx = await this.transactionRepository.findTransaction(transactionId);
            if (!findTx) {
                throw new AppError_1.default("Transaction not Found", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const findEvent = await this.transactionRepository.findEventId(findTx.eventId);
            if (findEvent?.organizerId !== organizerId) {
                throw new AppError_1.default("your not The Owner", statusCode_enum_1.StatusCode.CONFLICT);
            }
            if (findTx.status !== client_1.TransactionStatus.WAITING_CONFIRMATION) {
                throw new AppError_1.default("Must be waiting to confirmation status", statusCode_enum_1.StatusCode.CONFLICT);
            }
            if (status === client_1.TransactionStatus.DONE) {
                // update status transaksi jadi DONE
                const tx = await this.transactionRepository.updateStatus(findTx.id, status);
                //kurangi kuota tiket sesuai item yang dibeli
                await this.transactionRepository.updateIfDone(tx.id);
                //jika user pakai kupon, update isUsed & useAt
                if (tx.useCoupon) {
                    const findCoupon = await this.transactionRepository.findCoupon(tx.customerId);
                    if (!findCoupon?.coupon?.id) {
                        throw new AppError_1.default("Cannot Update Coupon", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                    }
                    await this.transactionRepository.doneUseCoupon(findCoupon.coupon.id);
                }
                // jika user pakai poin, tandai semua point sebagai sudah digunakan
                if (tx.usePoint) {
                    await this.transactionRepository.doneUsePoint(tx.customerId);
                }
                //ambil data event & customer untuk email
                const event = await this.transactionRepository.findEventId(findTx.eventId);
                const user = await this.transactionRepository.findCustomer(tx.customerId);
                if (!user || !event) {
                    throw new AppError_1.default("Failed To Send Email", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                //ambil data order item (nama tiket & jumlah)
                const orderItem = await this.transactionRepository.findOrderItem(tx.id);
                const myOrderItems = orderItem.map((item) => ({
                    name: item.ticketType.name,
                    quantity: item.quantity,
                }));
                //kirim email tiket ke customer
                await (0, sendEmail_1.sendEmail)(user.email, `Your Ticket ${event.name}`, (0, sendTicket_template_1.sendTicketTemplate)(user.name, event.name, event.startDate.toLocaleDateString("id-ID"), tx.transactionCode, myOrderItems));
                return tx;
            }
            if (status === client_1.TransactionStatus.REJECTED) {
                const tx = await this.transactionRepository.updateStatus(findTx.id, status);
                // Jika user pakai kupon, tandai kuponnya tidak digunakan
                if (tx.useCoupon) {
                    const findCoupon = await this.transactionRepository.findCoupon(tx.customerId);
                    if (!findCoupon?.coupon?.id) {
                        throw new AppError_1.default("Cannot Update Coupon", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                    }
                    await this.transactionRepository.rejectUseCoupon(findCoupon.coupon.id);
                }
                // Jika user pakai poin, kembalikan poinnya
                if (tx.usePoint) {
                    await this.transactionRepository.rejectUsePoint(tx.customerId);
                }
                // Ambil data event & customer untuk email
                const event = await this.transactionRepository.findEventId(findTx.eventId);
                const user = await this.transactionRepository.findCustomer(tx.customerId);
                if (!user || !event) {
                    throw new AppError_1.default("Failed To Send Email", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                // Kirim email penolakan dengan template HTML
                await (0, sendEmail_1.sendEmail)(user.email, `Bukti Pembayaran Ditolak - ${event.name}`, (0, sendTicketReject_template_1.rejectPaymentProofTemplate)(user.name));
                return tx;
            }
        };
        this.getListOrder = async (organizerId) => {
            const trasnsaction = await this.transactionRepository.showActiveOrderListByOrganizer(organizerId);
            return trasnsaction;
        };
    }
}
exports.default = TransactionService;
