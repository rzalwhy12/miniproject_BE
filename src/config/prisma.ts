import { PrismaClient } from "../../prisma/generated/client";

export const prisma = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});
