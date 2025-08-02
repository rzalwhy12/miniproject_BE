import {
  EventCategory,
  EventStatus,
  VoucherStatus,
} from "../../../prisma/generated/client";

export interface IDataTicketType {
  name: string;
  price: number;
  quota: number;
  descriptionTicket: string;
  benefit: string;
}

export interface IDataVoucher {
  discount: number;
  startDate: Date;
  endDate: Date;
  status: VoucherStatus;
}

export interface IDataEvent {
  name: string;
  description: string;
  syaratKetentuan?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: EventCategory;
  eventStatus: EventStatus;
  ticketTypes?: IDataTicketType[];
  vouchers?: IDataVoucher[];
}
