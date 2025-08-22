"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEditEventToRes = exports.mapEventToRes = void 0;
const mapEventToRes = (event) => {
    return {
        id: event.id,
        name: event.name,
        slug: event.slug,
        banner: event.banner,
        description: event.description,
        syaratKetentuan: event.syaratKetentuan,
        startDate: event.startDate,
        endDate: event.endDate,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        location: event.location,
        category: event.category,
        eventStatus: event.eventStatus,
        organizer: event.organizer,
        ticketTypes: event.ticketTypes,
        vouchers: event.vouchers,
        reviews: event.reviews,
    };
};
exports.mapEventToRes = mapEventToRes;
const mapEditEventToRes = (event) => ({
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    category: event.category,
    banner: event.banner,
    description: event.description || "",
    syaratKetentuan: event.syaratKetentuan || "",
    tickets: event.ticketTypes.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quota: ticket.quota,
        descriptionTicket: ticket.descriptionTicket || "",
        benefit: ticket.benefit || "",
    })),
    vouchers: event.vouchers.map((voucher) => ({
        discount: voucher.discount,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
    })),
});
exports.mapEditEventToRes = mapEditEventToRes;
