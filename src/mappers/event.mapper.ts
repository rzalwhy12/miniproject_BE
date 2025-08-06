
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
