import { tr } from "@faker-js/faker/.";
import { EventStatus, TransactionStatus } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";
import { ITransactionCreate } from "../dto/req/transacionReq.dto";
import { after } from "node:test";
import { generateTransactionCode } from "../utils/transactionCode";

export interface IOrderItemInput {
  ticketTypeId: number;
  quantity: number;
}

class TransactionRepository {
  public createTransaction = async (
    customerId: number,
    data: ITransactionCreate,
    useCoupon: boolean,
    usePoint: boolean,
    orderItems: {
      ticketTypeId: number;
      quantity: number;
      subTotal: number;
    }[],
    totalPrice: number
  ) => {
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); //waiting payment 2 jam
    return await prisma.transaction.create({
      data: {
        customerId,
        eventId: data.eventId,
        transactionCode: await generateTransactionCode(),
        status: TransactionStatus.WAITING_PAYMENT,
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
  public getTicketPrice = async (data: ITransactionCreate) => {
    return await Promise.all(
      data.orderItems.map(async (item) => {
        const ticket = await prisma.ticketType.findUnique({
          where: { id: item.ticketTypeId },
          select: { price: true },
        });

        const price = ticket?.price || 0;

        return {
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          subTotal: item.quantity * price,
        };
      })
    );
  };
  public findCoupon = async (customerId: number) => {
    return await prisma.referral.findFirst({
      where: {
        referredId: customerId,
      },
      include: {
        coupon: true,
      },
    });
  };
  public updateCoupenTempt = async (couponId: number) => {
    return await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedTemporarily: true,
      },
    });
  };
  public findPoint = async (customerId: number) => {
    return await prisma.point.findMany({
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
  public updatePointTempt = async (customerId: number) => {
    return await prisma.point.updateMany({
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
  public findEventId = async (eventId: number) => {
    return await prisma.event.findUnique({
      where: { id: eventId },
    });
  };
  public validVoucher = async (voucerCode: string) => {
    return await prisma.voucher.findUnique({
      where: { code: voucerCode },
    });
  };
  public isPublished = async (eventId: number) => {
    return prisma.event.findUnique({
      where: {
        id: eventId,
        eventStatus: EventStatus.PUBLISHED,
      },
    });
  };
  public uploadPaymentProof = async (
    transactionId: number,
    proofImage: string
  ) => {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: proofImage,
        status: TransactionStatus.WAITING_CONFIRMATION,
      },
    });
  };
  public findTransaction = async (transactionId: number) => {
    return await prisma.transaction.findUnique({
      where: { id: transactionId },
    });
  };
  public updateStatus = async (
    transactionId: number,
    status: TransactionStatus
  ) => {
    return prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: { status },
    });
  };
  public updateIfDone = async (transactionId: number) => {
    const orderItems = await prisma.orderItem.findMany({
      where: { transactionId },
      select: {
        ticketTypeId: true,
        quantity: true,
      },
    });

    const ops = orderItems.map((item) =>
      prisma.ticketType.update({
        where: { id: item.ticketTypeId },
        data: {
          quota: {
            decrement: item.quantity,
          },
        },
      })
    );

    return await prisma.$transaction(ops);
  };
  public findCustomer = async (custormerId: number) => {
    return await prisma.user.findUnique({
      where: { id: custormerId },
    });
  };
  public findOrderItem = async (transactionId: number) => {
    return await prisma.orderItem.findMany({
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
  public doneUsePoint = async (customerId: number) => {
    return await prisma.point.updateMany({
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
  public doneUseCoupon = async (couponId: number) => {
    return await prisma.coupon.update({
      where: { id: couponId },
      data: { isUsed: true, useAt: new Date(), usedTemporarily: false },
    });
  };
  public rejectUsePoint = async (customerId: number) => {
    return await prisma.point.updateMany({
      where: {
        userId: customerId,
        usedTemporarily: true,
      },
      data: {
        usedTemporarily: false,
      },
    });
  };
  public rejectUseCoupon = async (couponId: number) => {
    return await prisma.coupon.update({
      where: { id: couponId },
      data: { usedTemporarily: false },
    });
  };
  public showActiveOrderListByOrganizer = async (organizerId: number) => {
    return await prisma.transaction.findMany({
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

export default TransactionRepository;
