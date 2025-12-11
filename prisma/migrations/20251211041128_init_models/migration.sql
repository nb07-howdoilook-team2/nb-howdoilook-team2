/*
  Warnings:

  - You are about to drop the column `components` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Style` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Style" DROP COLUMN "components",
DROP COLUMN "createdAt",
DROP COLUMN "description",
ADD COLUMN     "compnents" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descripthion" TEXT;
