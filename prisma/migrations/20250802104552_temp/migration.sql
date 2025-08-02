/*
  Warnings:

  - You are about to drop the column `useTemp` on the `Point` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Point" DROP COLUMN "useTemp",
ADD COLUMN     "usedTemp" BOOLEAN NOT NULL DEFAULT false;
