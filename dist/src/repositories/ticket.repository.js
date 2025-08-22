"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class TicketRepository {
    async getTicketById(ticketTypeId) {
        return await prisma_1.prisma.ticketType.findUnique({
            where: { id: ticketTypeId },
            include: {
                event: {
                    select: { id: true, name: true },
                },
            },
        });
    }
}
exports.default = new TicketRepository();
