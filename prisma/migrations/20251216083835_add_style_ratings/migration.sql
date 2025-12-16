-- CreateTable
CREATE TABLE "Style" (
    "id" BIGSERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "thumbnail" TEXT,
    "categories" JSONB NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "curationCount" INTEGER NOT NULL DEFAULT 0,
    "ratingTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingTrendy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingPersonality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingPracticality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCostEffectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curation" (
    "id" BIGSERIAL NOT NULL,
    "styleId" BIGINT NOT NULL,
    "nickname" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "trendy" INTEGER NOT NULL,
    "personality" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "costEffectiveness" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,

    CONSTRAINT "Curation_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "Curation" ADD CONSTRAINT "Curation_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_curationId_fkey" FOREIGN KEY ("curationId") REFERENCES "Curation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
