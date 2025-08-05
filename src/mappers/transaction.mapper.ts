export const mapOrderListToRes = (transactions: any[]) => {
  return transactions.map((tx) => ({
    id: tx.id,
    transactionCode: tx.transactionCode,
    buyer: {
      id: tx.user.id,
      name: tx.user.name,
      email: tx.user.email,
    },
    event: {
      id: tx.event.id,
      name: tx.event.name,
      startDate: tx.event.startDate,
      endDate: tx.event.endDate,
    },
    orderDate: tx.createdAt,
    ticketList: tx.orderItems.map((item: any) => ({
      ticketTypeId: item.ticketType.id,
      ticketTypeName: item.ticketType.name,
      quantity: item.quantity,
      subTotal: item.subTotal,
    })),
    totalPrice: tx.totalPrice,
    paymentProof: tx.paymentProof,
    status: tx.status,
  }));
};
