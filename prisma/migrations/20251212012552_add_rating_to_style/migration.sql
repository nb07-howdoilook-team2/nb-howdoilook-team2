/*
  Warnings:

  - You are about to drop the column `costEffectivenessScore` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `individualityScore` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `oneLineReview` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `postNickname` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `practicalityScore` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `trendyScore` on the `Curation` table. All the data in the column will be lost.
  - Added the required column `content` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costEffectiveness` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personality` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practicality` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trendy` to the `Curation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curation" DROP COLUMN "costEffectivenessScore",
DROP COLUMN "individualityScore",
DROP COLUMN "oneLineReview",
DROP COLUMN "postNickname",
DROP COLUMN "practicalityScore",
DROP COLUMN "trendyScore",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "costEffectiveness" INTEGER NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "personality" INTEGER NOT NULL,
ADD COLUMN     "practicality" INTEGER NOT NULL,
ADD COLUMN     "trendy" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Reply" (
    "id" BIGSERIAL NOT NULL,
    "curationId" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reply_curationId_key" ON "Reply"("curationId");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_curationId_fkey" FOREIGN KEY ("curationId") REFERENCES "Curation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
