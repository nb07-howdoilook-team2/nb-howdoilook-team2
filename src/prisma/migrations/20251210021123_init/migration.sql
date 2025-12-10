-- CreateTable
CREATE TABLE "Style" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "thumbnail" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "components" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "curatedCount" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);
