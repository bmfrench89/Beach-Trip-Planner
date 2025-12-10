-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "price" DOUBLE PRECISION,
    "image" TEXT,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
