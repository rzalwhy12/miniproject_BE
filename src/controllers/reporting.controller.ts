import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";
import { StatusCode } from "../constants/statusCode.enum";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";

export const reporting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;
    const organizerId = res.locals.decript.id;

    const event = await prisma.event.findUnique({
      where: { slug },
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

    if (!event) {
      throw new AppError("event not found", StatusCode.NOT_FOUND);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("unauthorized access", StatusCode.UNAUTHORIZED);
    }

    const totalParticipants = event.transactions.reduce((acc, tx) => {
      const total = tx.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      return acc + total;
    }, 0);

    const totalRevenue = event.transactions.reduce((acc, tx) => {
      const subtotal = tx.orderItems.reduce((sum, item) => {
        return sum + item.quantity * item.ticketType.price;
      }, 0);
      return acc + subtotal;
    }, 0);

    sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, {
      eventName: event.name,
      totalParticipants,
      totalRevenue,
      totalTransactions: event.transactions.length,
    });
  } catch (error) {
    next(error);
  }
};

export const reportingAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerId = res.locals.decript.id;

    // Ambil semua event milik organizer + transaksi DONE
    const events = await prisma.event.findMany({
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

    // Format data laporan
    const reportList = events.map((event) => {
      const totalTickets = event.transactions.reduce((totalTx, tx) => {
        const totalOrder = tx.orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return totalTx + totalOrder;
      }, 0);

      const totalRevenue = event.transactions.reduce((rev, tx) => {
        const subtotal = tx.orderItems.reduce((sum, item) => {
          return sum + item.quantity * item.ticketType.price;
        }, 0);
        return rev + subtotal;
      }, 0);

      return {
        eventName: event.name,
        status: event.eventStatus,
        startDate: event.startDate,
        endDate: event.endDate,
        totalTickets,
        totalRevenue,
      };
    });

    sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, reportList);
  } catch (error) {
    next(error);
  }
};
