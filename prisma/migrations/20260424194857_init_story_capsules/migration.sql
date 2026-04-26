-- CreateTable
CREATE TABLE "StoryCapsule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "state" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "caption" TEXT,
    "quote" TEXT,
    "song" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryCapsule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryCapsule_userId_idx" ON "StoryCapsule"("userId");

-- CreateIndex
CREATE INDEX "StoryCapsule_placeName_idx" ON "StoryCapsule"("placeName");
