import {
  EventCategory,
  EventStatus,
  VoucherStatus,
} from "../../prisma/generated/client";

export interface ITicketTypeCreate {
  name: string;
  price: number;
  quota: number;
  descriptionTicket: string;
  benefit: string;
}

export interface IVoucherCreate {
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  status: VoucherStatus;
}

export interface IEventCreate {
  name: string;
  description: string;
  syaratKetentuan?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: EventCategory;
  eventStatus: EventStatus;
  ticketTypes?: ITicketTypeCreate[];
  vouchers?: IVoucherCreate[];
}
