/*
  Warnings:

  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `syaratKetentuan` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `benefit` on table `TicketType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descriptionTicket` on table `TicketType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "syaratKetentuan" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."TicketType" ALTER COLUMN "benefit" SET NOT NULL,
ALTER COLUMN "descriptionTicket" SET NOT NULL;
