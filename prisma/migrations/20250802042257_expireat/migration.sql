/*
  Warnings:

  - Made the column `expiredAt` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "expiredAt" SET NOT NULL;
