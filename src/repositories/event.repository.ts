import { EventStatus } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";
import { IDataEvent } from "../dto/req/eventReq.dto";
import { generateVoucherCode } from "../utils/generateCodeVoucher";
import { generateSlug } from "../utils/slugFly";

class EventRepository {
  //create event
  public createEventRepo = async (
    eventCreate: IDataEvent,
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

    // Generate voucher code jika ada
    const preparedVouchers = vouchers
      ? await Promise.all(
          vouchers.map(async (voucher) => ({
            code: await generateVoucherCode(),
            discount: voucher.discount,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            status: voucher.status,
          }))
        )
      : undefined;

    return await prisma.event.create({
      data: {
        name,
        slug: generateSlug(name),
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
  public isHaveBankAccount = async (organizerId: number) => {
    return await prisma.user.findUnique({
      where: {
        id: organizerId,
      },
    });
  };

  //update event
  public updateEventRepo = async (eventId: number, eventCreate: IDataEvent) => {
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

    // Hapus relasi lama
    await prisma.ticketType.deleteMany({ where: { eventId } });
    await prisma.voucher.deleteMany({ where: { eventId } });

    // Generate kode voucher baru
    const preparedVouchers = vouchers
      ? await Promise.all(
          vouchers.map(async (voucher) => ({
            code: await generateVoucherCode(),
            discount: voucher.discount,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            status: voucher.status,
          }))
        )
      : undefined;

    return await prisma.event.update({
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
  public uploadBanner = async (eventId: number, banner: string) => {
    return await prisma.event.update({
      where: { id: eventId },
      data: { banner },
    });
  };

  //cek ownerevent
  public isOwnerEvent = async (organizerId: number, eventId: number) => {
    return await prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId,
      },
    });
  };

  public deleteEvent = async (eventId: number) => {
    return await prisma.event.delete({
      where: { id: eventId },
    });
  };

  public findMyEvent = async (organizerId: number, status: string) => {
    return await prisma.event.findMany({
      where: {
        organizerId: organizerId,
        eventStatus: status as EventStatus,
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

  public findAllEvents = async () => {
    return await prisma.event.findMany({
      // Mengambil semua event tanpa filter eventStatus
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

  public findEventById = async (eventId: number) => {
    return await prisma.event.findUnique({
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

  public findEventBySlug = async (slug: string) => {
    return await prisma.event.findUnique({
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
}

export default EventRepository;
