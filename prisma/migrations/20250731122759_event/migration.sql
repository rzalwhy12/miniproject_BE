/*
  Warnings:

  - Added the required column `eventStatus` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "eventStatus" "public"."EventStatus" NOT NULL;
