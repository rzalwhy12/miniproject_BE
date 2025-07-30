import { EventRepository } from "../repositories/event.repository";
import { Event } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";

export class EventService {
    private repo = new EventRepository();

    async createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">) {
        return this.repo.create(data);
    }

    async createTicketTypes(eventId: number, tickets: any[]) {
        try {
            const ticketPromises = tickets.map(ticket => {
                // Remove "Rp" and dots from price, then convert to number
                const cleanPrice = ticket.price.replace(/Rp|\.|\s/g, '').replace(',', '');
                const priceNumber = parseInt(cleanPrice);
                
                console.log(`Processing ticket: ${ticket.name}, price: ${ticket.price} -> ${priceNumber}`);
                
                return prisma.ticketType.create({
                    data: {
                        name: ticket.name,
                        price: priceNumber,
                        quota: 100, // Default quota
                        description: ticket.description,
                        eventId: eventId
                    }
                });
            });
            
            return Promise.all(ticketPromises);
        } catch (error) {
            console.error("Error creating ticket types:", error);
            throw error;
        }
    }

    async updateEvent(id: number, data: Partial<Event>) {
        return this.repo.update(id, data);
    }

    async deleteEvent(id: number) {
        return this.repo.delete(id);
    }
}
