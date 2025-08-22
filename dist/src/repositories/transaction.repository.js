"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
const prisma_1 = require("../config/prisma");
const transactionCode_1 = require("../utils/transactionCode");
class TransactionRepository {
    constructor() {
        this.getTransactionByCode = async (transactionCode) => {
            return await prisma_1.prisma.transaction.findUnique({
                where: { transactionCode },
                include: {
                    user: true,
                    event: true,
                    orderItems: {
                        include: {
                            ticketType: true,
                        },
                    },
                },
            });
        };
        this.getTransactionsByUserId = async (userId) => {
            return await prisma_1.prisma.transaction.findMany({
                where: { customerId: userId },
                include: {
                    user: true,
                    event: true,
                    orderItems: {
                        include: {
                            ticketType: true,
                        },
                    },
                },
            });
        };
        this.createTransaction = async (customerId, data, useCoupon, usePoint, orderItems, totalPrice) => {
            const now = new Date();
            const expiredAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); //waiting payment 2 jam
            return await prisma_1.prisma.transaction.create({
                data: {
                    customerId,
                    eventId: data.eventId,
                    transactionCode: await (0, transactionCode_1.generateTransactionCode)(),
                    status: client_1.TransactionStatus.WAITING_PAYMENT,
                    useCoupon,
                    usePoint,
                    totalPrice,
                    expiredAt,
                    orderItems: {
                        create: orderItems,
                    },
                },
                include: {
                    user: true,
                    event: true,
                    orderItems: {
                        include: {
                            ticketType: true,
                        },
                    },
                },
            });
        };
        this.getTicketPrice = async (data) => {
            return await Promise.all(data.orderItems.map(async (item) => {
                const ticket = await prisma_1.prisma.ticketType.findUnique({
                    where: { id: item.ticketTypeId },
                    select: { price: true },
                });
                const price = ticket?.price || 0;
                return {
                    ticketTypeId: item.ticketTypeId,
                    quantity: item.quantity,
                    subTotal: item.quantity * price,
                };
            }));
        };
        this.findCoupon = async (customerId) => {
            return await prisma_1.prisma.referral.findFirst({
                where: {
                    referredId: customerId,
                },
                include: {
                    coupon: true,
                },
            });
        };
        this.updateCoupenTempt = async (couponId) => {
            return await prisma_1.prisma.coupon.update({
                where: { id: couponId },
                data: {
                    usedTemporarily: true,
                },
            });
        };
        this.findPoint = async (customerId) => {
            return await prisma_1.prisma.point.findMany({
                where: {
                    userId: customerId, //hanya ambil point milik user
                    isUsed: false,
                    expiresAt: { gt: new Date() }, // belum expired
                },
                orderBy: {
                    expiresAt: "asc", //yang paling dekat expired duluan
                },
            });
        };
        this.updatePointTempt = async (customerId) => {
            return await prisma_1.prisma.point.updateMany({
                where: {
                    userId: customerId,
                    isUsed: false,
                    usedTemporarily: false,
                },
                data: {
                    usedTemporarily: true,
                },
            });
        };
        this.findEventId = async (eventId) => {
            return await prisma_1.prisma.event.findUnique({
                where: { id: eventId },
            });
        };
        this.validVoucher = async (voucerCode) => {
            return await prisma_1.prisma.voucher.findUnique({
                where: { code: voucerCode },
            });
        };
        this.isPublished = async (eventId) => {
            return prisma_1.prisma.event.findUnique({
                where: {
                    id: eventId,
                    eventStatus: client_1.EventStatus.PUBLISHED,
                },
            });
        };
        this.uploadPaymentProof = async (transactionId, proofImage) => {
            return await prisma_1.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    paymentProof: proofImage,
                    status: client_1.TransactionStatus.WAITING_CONFIRMATION,
                },
            });
        };
        this.findTransaction = async (transactionId) => {
            return await prisma_1.prisma.transaction.findUnique({
                where: { id: transactionId },
            });
        };
        this.updateStatus = async (transactionId, status) => {
            return prisma_1.prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: { status },
            });
        };
        this.updateIfDone = async (transactionId) => {
            const orderItems = await prisma_1.prisma.orderItem.findMany({
                where: { transactionId },
                select: {
                    ticketTypeId: true,
                    quantity: true,
                },
            });
            const ops = orderItems.map((item) => prisma_1.prisma.ticketType.update({
                where: { id: item.ticketTypeId },
                data: {
                    quota: {
                        decrement: item.quantity,
                    },
                },
            }));
            return await prisma_1.prisma.$transaction(ops);
        };
        this.findCustomer = async (custormerId) => {
            return await prisma_1.prisma.user.findUnique({
                where: { id: custormerId },
            });
        };
        this.findOrderItem = async (transactionId) => {
            return await prisma_1.prisma.orderItem.findMany({
                where: { transactionId },
                select: {
                    quantity: true,
                    ticketType: {
                        select: {
                            name: true,
                            price: true,
                        },
                    },
                },
            });
        };
        this.doneUsePoint = async (customerId) => {
            return await prisma_1.prisma.point.updateMany({
                where: {
                    userId: customerId,
                    usedTemporarily: true,
                },
                data: {
                    isUsed: true,
                    usedTemporarily: false,
                    useAt: new Date(),
                },
            });
        };
        this.doneUseCoupon = async (couponId) => {
            return await prisma_1.prisma.coupon.update({
                where: { id: couponId },
                data: { isUsed: true, useAt: new Date(), usedTemporarily: false },
            });
        };
        this.rejectUsePoint = async (customerId) => {
            return await prisma_1.prisma.point.updateMany({
                where: {
                    userId: customerId,
                    usedTemporarily: true,
                },
                data: {
                    usedTemporarily: false,
                },
            });
        };
        this.rejectUseCoupon = async (couponId) => {
            return await prisma_1.prisma.coupon.update({
                where: { id: couponId },
                data: { usedTemporarily: false },
            });
        };
        this.showActiveOrderListByOrganizer = async (organizerId) => {
            return await prisma_1.prisma.transaction.findMany({
                where: {
                    status: "WAITING_CONFIRMATION",
                    event: {
                        organizerId,
                        endDate: {
                            gt: new Date(),
                        },
                    },
                },
                include: {
                    event: {
                        select: {
                            id: true,
                            name: true,
                            startDate: true,
                            endDate: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    orderItems: {
                        include: {
                            ticketType: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        };
    }
}
exports.default = TransactionRepository;
