-- CreateTable
CREATE TABLE "Curation" (
    "id" BIGSERIAL NOT NULL,
    "styleId" BIGINT NOT NULL,
    "trendyScore" BIGINT NOT NULL,
    "individualityScore" BIGINT NOT NULL,
    "practicalityScore" BIGINT NOT NULL,
    "costEffectivenessScore" BIGINT NOT NULL,
    "oneLineReview" TEXT NOT NULL,
    "postNickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Curation" ADD CONSTRAINT "Curation_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
