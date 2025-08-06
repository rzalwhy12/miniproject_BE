import { prisma } from "../config/prisma";

class TicketRepository {
    public async getTicketById(ticketTypeId: number) {
        return await prisma.ticketType.findUnique({
            where: { id: ticketTypeId },
            include: {
                event: {
                    select: { id: true, name: true },
                },
            },
        });
    }
}

export default new TicketRepository();
