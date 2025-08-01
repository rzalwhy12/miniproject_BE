-- DropForeignKey
ALTER TABLE "public"."TicketType" DROP CONSTRAINT "TicketType_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voucher" DROP CONSTRAINT "Voucher_eventId_fkey";

-- AddForeignKey
ALTER TABLE "public"."TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
