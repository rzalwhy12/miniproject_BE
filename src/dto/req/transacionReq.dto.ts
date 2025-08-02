import { TransactionStatus } from "../../../prisma/generated/client";

export interface ITransactionCreate {
  eventId: number;
  paymentProof?: string;
  usePoint: boolean;
  useCoupon: boolean;
  voucherCode?: string;
  orderItems: {
    ticketTypeId: number;
    quantity: number;
  }[];
}
