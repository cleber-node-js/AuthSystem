-- AlterTable
ALTER TABLE "_ArtistEvents" ADD CONSTRAINT "_ArtistEvents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArtistEvents_AB_unique";

-- AlterTable
ALTER TABLE "_EventToFavorite" ADD CONSTRAINT "_EventToFavorite_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventToFavorite_AB_unique";

-- AlterTable
ALTER TABLE "_FavoriteToUser" ADD CONSTRAINT "_FavoriteToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FavoriteToUser_AB_unique";

-- AlterTable
ALTER TABLE "_UserVerificationTokenToUser" ADD CONSTRAINT "_UserVerificationTokenToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserVerificationTokenToUser_AB_unique";
