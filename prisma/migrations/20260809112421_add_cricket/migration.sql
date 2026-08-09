-- CreateTable
CREATE TABLE "CricketTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "tagline" TEXT,
    "story" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CricketTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CricketPlayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "photoMediaId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CricketPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "result" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CricketMatch" (
    "id" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "result" TEXT,
    "summary" TEXT,
    "tournamentId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CricketMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CricketMemory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "mediaId" TEXT,
    "date" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CricketMemory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CricketPlayer" ADD CONSTRAINT "CricketPlayer_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketMatch" ADD CONSTRAINT "CricketMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketMemory" ADD CONSTRAINT "CricketMemory_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
