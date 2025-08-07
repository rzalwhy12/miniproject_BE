export const mapEventToRes = (event: any) => {
  return {
    id: event.id,
    name: event.name,
    slug: event.slug,
    banner: event.banner,
    description: event.description,
    syaratKetentuan: event.syaratKetentuan,
    startDate: event.startDate,
    endDate: event.endDate,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    location: event.location,
    category: event.category,
    eventStatus: event.eventStatus,
    organizer: event.organizer,
    ticketTypes: event.ticketTypes,
    vouchers: event.vouchers,
    reviews: event.reviews,
  };
};

export const mapEditEventToRes = (event: any) => ({
  name: event.name,
  startDate: event.startDate,
  endDate: event.endDate,
  location: event.location,
  category: event.category,
  banner: event.banner,
  description: event.description || "",
  syaratKetentuan: event.syaratKetentuan || "",
  tickets: event.ticketTypes.map((ticket: any) => ({
    id: ticket.id,
    name: ticket.name,
    price: ticket.price,
    quota: ticket.quota,
    descriptionTicket: ticket.descriptionTicket || "",
    benefit: ticket.benefit || "",
  })),
  vouchers: event.vouchers.map((voucher: any) => ({
    discount: voucher.discount,
    startDate: voucher.startDate,
    endDate: voucher.endDate,
  })),
});
