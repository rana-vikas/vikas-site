-- CreateTable
CREATE TABLE "FitnessJourney" (
    "id" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "story" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FitnessJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FitnessChallenge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lengthDays" INTEGER NOT NULL,
    "summary" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FitnessChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FitnessEntry" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "title" TEXT,
    "notes" TEXT,
    "mediaId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FitnessEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "result" TEXT,
    "location" TEXT,
    "date" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FitnessChallenge_slug_key" ON "FitnessChallenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FitnessEntry_challengeId_dayNumber_key" ON "FitnessEntry"("challengeId", "dayNumber");

-- AddForeignKey
ALTER TABLE "FitnessEntry" ADD CONSTRAINT "FitnessEntry_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "FitnessChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FitnessEntry" ADD CONSTRAINT "FitnessEntry_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
