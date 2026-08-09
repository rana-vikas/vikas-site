-- CreateTable
CREATE TABLE "TravelLocation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelMemory" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "mediaId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelMemory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TravelLocation" ADD CONSTRAINT "TravelLocation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TravelTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelMemory" ADD CONSTRAINT "TravelMemory_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "TravelTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelMemory" ADD CONSTRAINT "TravelMemory_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
