-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "aperture" TEXT,
ADD COLUMN     "camera" TEXT,
ADD COLUMN     "focalLength" TEXT,
ADD COLUMN     "iso" INTEGER,
ADD COLUMN     "lens" TEXT,
ADD COLUMN     "shutterSpeed" TEXT,
ADD COLUMN     "takenAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);
