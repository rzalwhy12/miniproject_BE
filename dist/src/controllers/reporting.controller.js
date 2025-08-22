"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../errors/AppError"));
const statusCode_enum_1 = require("../constants/statusCode.enum");
const SendResSuccess_1 = require("../utils/SendResSuccess");
const successMessage_enum_1 = require("../constants/successMessage.enum");
class ReportingController {
    constructor() {
        this.reporting = async (req, res, next) => {
            try {
                const slug = req.params.slug;
                const organizerId = res.locals.decript.id;
                const event = await prisma_1.prisma.event.findUnique({
                    where: { slug },
                    include: {
                        transactions: {
                            where: {
                                status: "DONE",
                            },
                            include: {
                                user: true, // include user info for participant
                                orderItems: {
                                    include: {
                                        ticketType: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!event) {
                    throw new AppError_1.default("event not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                if (event.organizerId !== organizerId) {
                    throw new AppError_1.default("unauthorized access", statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                let totalParticipants = 0;
                let totalRevenue = 0;
                const participants = [];
                for (const tx of event.transactions) {
                    for (const item of tx.orderItems) {
                        participants.push({
                            name: tx.user.name,
                            email: tx.user.email,
                            ticketType: item.ticketType.name,
                            quantity: item.quantity,
                        });
                        totalParticipants += item.quantity;
                        totalRevenue += item.quantity * item.ticketType.price;
                    }
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, {
                    eventName: event.name,
                    totalParticipants,
                    totalRevenue,
                    totalTransactions: event.transactions.length,
                    participants,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.reportingAll = async (req, res, next) => {
            try {
                const organizerId = res.locals.decript.id;
                const events = await prisma_1.prisma.event.findMany({
                    where: {
                        organizerId,
                        transactions: {
                            some: {
                                status: "DONE",
                            },
                        },
                    },
                    include: {
                        transactions: {
                            where: {
                                status: "DONE",
                            },
                            include: {
                                orderItems: {
                                    include: {
                                        ticketType: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const reportList = events.map((event) => {
                    const totalTickets = event.transactions.reduce((totalTx, tx) => {
                        const totalOrder = tx.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                        return totalTx + totalOrder;
                    }, 0);
                    const totalRevenue = event.transactions.reduce((rev, tx) => {
                        const subtotal = tx.orderItems.reduce((sum, item) => {
                            return sum + item.quantity * item.ticketType.price;
                        }, 0);
                        return rev + subtotal;
                    }, 0);
                    // === Tambah chartData per minggu ===
                    const chartMap = {};
                    event.transactions.forEach((tx) => {
                        const date = new Date(tx.createdAt);
                        // Hitung minggu ke berapa dalam tahun
                        const startOfYear = new Date(date.getFullYear(), 0, 1);
                        const daysSinceStartOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
                        const weekNumber = Math.ceil((daysSinceStartOfYear + startOfYear.getDay() + 1) / 7);
                        const weekKey = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`; // format: 2024-W15
                        const quantity = tx.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                        if (!chartMap[weekKey]) {
                            chartMap[weekKey] = 0;
                        }
                        chartMap[weekKey] += quantity;
                    });
                    const chartData = Object.entries(chartMap).map(([week, sales]) => ({
                        week,
                        sales,
                    }));
                    return {
                        eventName: event.name,
                        status: event.eventStatus,
                        startDate: event.startDate,
                        endDate: event.endDate,
                        totalTickets,
                        totalRevenue,
                        chartData,
                    };
                });
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, reportList);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ReportingController;
