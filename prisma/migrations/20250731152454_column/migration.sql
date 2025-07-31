/*
  Warnings:

  - You are about to drop the column `description` on the `TicketType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TicketType" DROP COLUMN "description",
ADD COLUMN     "descriptionTicket" TEXT;
