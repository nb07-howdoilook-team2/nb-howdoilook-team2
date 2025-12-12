/*
  Warnings:

  - You are about to drop the column `components` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `curatedCount` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Style` table. All the data in the column will be lost.
  - Added the required column `categories` to the `Style` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Style` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Style` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Style" DROP COLUMN "components",
DROP COLUMN "createAt",
DROP COLUMN "curatedCount",
DROP COLUMN "description",
DROP COLUMN "images",
DROP COLUMN "views",
ADD COLUMN     "categories" JSONB NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "curationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6),
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;
