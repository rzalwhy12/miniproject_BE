-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "syaratKetentuan" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."TicketType" ALTER COLUMN "benefit" DROP NOT NULL,
ALTER COLUMN "descriptionTicket" DROP NOT NULL;
