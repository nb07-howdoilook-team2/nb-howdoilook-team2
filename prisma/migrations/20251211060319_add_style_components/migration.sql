/*
  Warnings:

  - You are about to drop the column `compnents` on the `Style` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Style" DROP COLUMN "compnents",
ADD COLUMN     "components" TEXT[] DEFAULT ARRAY[]::TEXT[];
