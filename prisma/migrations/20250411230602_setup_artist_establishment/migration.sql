-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_establishmentId_fkey";

-- CreateTable
CREATE TABLE "EstablishmentArtist" (
    "artistId" INTEGER NOT NULL,
    "establishmentId" INTEGER NOT NULL,
    "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING',
    "approvalMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstablishmentArtist_pkey" PRIMARY KEY ("artistId","establishmentId")
);

-- AddForeignKey
ALTER TABLE "EstablishmentArtist" ADD CONSTRAINT "EstablishmentArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentArtist" ADD CONSTRAINT "EstablishmentArtist_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
