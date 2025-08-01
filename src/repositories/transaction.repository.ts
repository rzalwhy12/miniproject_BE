import { prisma } from "../config/prisma";
import { IOrderCreateReq } from "../dto/transacionReq.dto";

class TransactionRepository {
  public createTransaction = async (
    customerId: number,
    data: IOrderCreateReq
  ) => {
    return await prisma.transaction.create({
      data: {
        customerId,
        eventId: data.eventId,
        status: "WAITING_PAYMENT",
        orderItems: {
          create: data.orderItems.map((item) => ({
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
            subTotal: 0, // Akan diisi di service
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  };

  public getTransactionById = async (id: number) => {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { orderItems: true },
    });
  };
}

export default TransactionRepository;
