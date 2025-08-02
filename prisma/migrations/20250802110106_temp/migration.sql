/*
  Warnings:

  - You are about to drop the column `usedTemp` on the `Point` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Point" DROP COLUMN "usedTemp",
ADD COLUMN     "useAt" TIMESTAMP(3),
ADD COLUMN     "usedTemporarily" BOOLEAN NOT NULL DEFAULT false;
