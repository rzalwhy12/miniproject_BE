/*
  Warnings:

  - You are about to drop the column `image` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `statusEvent` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `syaratKetentuan` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `EventTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EventTag" DROP CONSTRAINT "EventTag_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventTag" DROP CONSTRAINT "EventTag_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "image",
DROP COLUMN "statusEvent",
DROP COLUMN "syaratKetentuan";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "totalPrice";

-- DropTable
DROP TABLE "public"."EventTag";

-- DropTable
DROP TABLE "public"."Tag";
