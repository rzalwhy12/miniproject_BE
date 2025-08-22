"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
const prisma_1 = require("../config/prisma");
const generateCodeVoucher_1 = require("../utils/generateCodeVoucher");
const slugFly_1 = require("../utils/slugFly");
class EventRepository {
    constructor() {
        this.getTransactionEvent = async () => {
            return await prisma_1.prisma.event.findMany({
                include: {
                    _count: {
                        select: { transactions: true },
                    },
                },
                orderBy: {
                    transactions: {
                        _count: 'desc',
                    },
                },
            });
        };
        //create event
        this.createEventRepo = async (eventCreate, organizerId) => {
            const { name, description, syaratKetentuan, startDate, endDate, location, category, eventStatus, ticketTypes, vouchers, } = eventCreate;
            // Generate voucher code jika ada
            const preparedVouchers = vouchers
                ? await Promise.all(vouchers.map(async (voucher) => ({
                    code: await (0, generateCodeVoucher_1.generateVoucherCode)(),
                    discount: voucher.discount,
                    startDate: voucher.startDate,
                    endDate: voucher.endDate,
                    status: voucher.status,
                })))
                : undefined;
            return await prisma_1.prisma.event.create({
                data: {
                    name,
                    slug: (0, slugFly_1.generateSlug)(name),
                    description,
                    syaratKetentuan,
                    startDate,
                    endDate,
                    location,
                    category,
                    eventStatus,
                    organizerId,
                    ticketTypes: ticketTypes
                        ? {
                            create: ticketTypes.map((ticket) => ({
                                name: ticket.name,
                                price: ticket.price,
                                quota: ticket.quota,
                                descriptionTicket: ticket.descriptionTicket,
                                benefit: ticket.benefit,
                            })),
                        }
                        : undefined,
                    vouchers: preparedVouchers
                        ? {
                            create: preparedVouchers,
                        }
                        : undefined,
                },
                include: {
                    ticketTypes: true,
                    vouchers: true,
                },
            });
        };
        this.isHaveBankAccount = async (organizerId) => {
            return await prisma_1.prisma.user.findUnique({
                where: {
                    id: organizerId,
                },
            });
        };
        //update event
        this.updateEventRepo = async (eventId, eventCreate) => {
            const { name, description, syaratKetentuan, startDate, endDate, location, category, eventStatus, ticketTypes, vouchers, } = eventCreate;
            // Hapus relasi lama
            await prisma_1.prisma.ticketType.deleteMany({ where: { eventId } });
            await prisma_1.prisma.voucher.deleteMany({ where: { eventId } });
            // Generate kode voucher baru
            const preparedVouchers = vouchers
                ? await Promise.all(vouchers.map(async (voucher) => ({
                    code: await (0, generateCodeVoucher_1.generateVoucherCode)(),
                    discount: voucher.discount,
                    startDate: voucher.startDate,
                    endDate: voucher.endDate,
                    status: voucher.status,
                })))
                : undefined;
            return await prisma_1.prisma.event.update({
                where: { id: eventId },
                data: {
                    name,
                    description,
                    syaratKetentuan,
                    startDate,
                    endDate,
                    location,
                    category,
                    eventStatus,
                    ticketTypes: ticketTypes
                        ? {
                            create: ticketTypes.map((ticket) => ({
                                name: ticket.name,
                                price: ticket.price,
                                quota: ticket.quota,
                                descriptionTicket: ticket.descriptionTicket,
                                benefit: ticket.benefit,
                            })),
                        }
                        : undefined,
                    vouchers: preparedVouchers
                        ? {
                            create: preparedVouchers,
                        }
                        : undefined,
                },
                include: {
                    ticketTypes: true,
                    vouchers: true,
                },
            });
        };
        //upload event
        this.uploadBanner = async (eventId, banner) => {
            return await prisma_1.prisma.event.update({
                where: { id: eventId },
                data: { banner },
            });
        };
        //cek ownerevent
        this.isOwnerEvent = async (organizerId, eventId) => {
            return await prisma_1.prisma.event.findFirst({
                where: {
                    id: eventId,
                    organizerId,
                },
            });
        };
        this.deleteEvent = async (eventId) => {
            return await prisma_1.prisma.event.delete({
                where: { id: eventId },
            });
        };
        this.findMyEvent = async (organizerId, status) => {
            return await prisma_1.prisma.event.findMany({
                where: {
                    organizerId: organizerId,
                    eventStatus: status,
                },
                include: {
                    ticketTypes: true,
                    transactions: true,
                    reviews: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        };
        this.findAllEvents = async () => {
            return await prisma_1.prisma.event.findMany({
                where: { eventStatus: client_1.EventStatus.PUBLISHED },
                include: {
                    ticketTypes: true,
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        };
        this.findEventById = async (eventId) => {
            return await prisma_1.prisma.event.findUnique({
                where: {
                    id: eventId,
                },
                include: {
                    ticketTypes: true,
                    vouchers: true,
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        };
        this.findEventBySlug = async (slug) => {
            return await prisma_1.prisma.event.findUnique({
                where: {
                    slug: slug,
                },
                include: {
                    ticketTypes: true,
                    vouchers: true,
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        };
        this.getEditEvent = async (slug) => {
            return await prisma_1.prisma.event.findUnique({
                where: { slug },
                include: {
                    ticketTypes: true,
                    vouchers: true,
                },
            });
        };
    }
}
exports.default = EventRepository;
