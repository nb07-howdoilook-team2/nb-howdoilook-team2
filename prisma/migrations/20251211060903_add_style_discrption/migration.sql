/*
  Warnings:

  - You are about to drop the column `descripthion` on the `Style` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Style" DROP COLUMN "descripthion",
ADD COLUMN     "description" TEXT;
