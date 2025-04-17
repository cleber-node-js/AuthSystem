/*
  Warnings:

  - You are about to drop the `EstablishmentArtist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EstablishmentArtist" DROP CONSTRAINT "EstablishmentArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "EstablishmentArtist" DROP CONSTRAINT "EstablishmentArtist_establishmentId_fkey";

-- DropTable
DROP TABLE "EstablishmentArtist";

-- CreateTable
CREATE TABLE "establishment_artists" (
    "artistId" INTEGER NOT NULL,
    "establishmentId" INTEGER NOT NULL,
    "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING',
    "approvalMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_artists_pkey" PRIMARY KEY ("artistId","establishmentId")
);

-- AddForeignKey
ALTER TABLE "establishment_artists" ADD CONSTRAINT "establishment_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_artists" ADD CONSTRAINT "establishment_artists_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
