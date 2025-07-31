import { prisma } from "../config/prisma";
import { IEventCreate } from "../dto/eventReq.dto";

class EventRepository {
  public createEventRepo = async (
    eventCreate: IEventCreate,
    organizerId: number
  ) => {
    const {
      name,
      description,
      syaratKetentuan,
      startDate,
      endDate,
      location,
      category,
      eventStatus,
      ticketTypes,
      vouchers,
    } = eventCreate;

    return await prisma.event.create({
      data: {
        name,
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
        vouchers: vouchers
          ? {
              create: vouchers.map((voucher) => ({
                code: voucher.code,
                discount: voucher.discount,
                startDate: voucher.startDate,
                endDate: voucher.endDate,
                status: voucher.status,
              })),
            }
          : undefined,
      },
      include: {
        ticketTypes: true,
        vouchers: true,
      },
    });
  };
  public uploadBanner = async (eventId: number, banner: string) => {
    return await prisma.event.update({
      where: {
        id: eventId,
      },
      data: { banner },
    });
  };
}

export default EventRepository;
