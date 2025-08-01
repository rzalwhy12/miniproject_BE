import { TransactionStatus } from "../../prisma/generated/client";

export interface IOrderItemReq {
  ticketTypeId: number;
  quantity: number;
}

export interface IOrderCreateReq {
  eventId: number;
  orderItems: IOrderItemReq[];
}
