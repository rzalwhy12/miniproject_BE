import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrganizers = async () => {
    return await prisma.organizer.findMany();
};
