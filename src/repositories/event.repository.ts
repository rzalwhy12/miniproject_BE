import { prisma } from "../config/prisma";
import { Event } from "../../prisma/generated/client";

export class EventRepository {
    async create(data: Omit<Event, "id" | "createdAt" | "updatedAt">) {
        // Validate required fields before creating
        if (!data.name || !data.startDate || !data.endDate || !data.location) {
            throw new Error("Missing required fields for event creation");
        }
        
        return prisma.event.create({ 
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    async update(id: number, data: Partial<Event>) {
        return prisma.event.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    async delete(id: number) {
        return prisma.event.delete({
            where: { id }
        });
    }
}
