/*
  Warnings:

  - You are about to drop the column `jenisKelamin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalLahir` on the `User` table. All the data in the column will be lost.
  - Added the required column `brithDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "jenisKelamin",
DROP COLUMN "tanggalLahir",
ADD COLUMN     "brithDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;
