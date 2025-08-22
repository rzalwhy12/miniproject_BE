"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getOrganizers = async () => {
    return await prisma.organizer.findMany();
};
exports.getOrganizers = getOrganizers;
