/*
  Warnings:

  - Added the required column `banner` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "syaratKetentuan" TEXT;
