-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "useCoupon" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usePoint" BOOLEAN NOT NULL DEFAULT false;
