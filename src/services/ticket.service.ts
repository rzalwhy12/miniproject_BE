import ticketRepository from "../repositories/ticket.repository";

class TicketService {
  public async getTicketById(ticketTypeId: number) {
    return await ticketRepository.getTicketById(ticketTypeId);
  }
}

export default new TicketService();
