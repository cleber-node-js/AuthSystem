/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- CreateTable
CREATE TABLE "_FavoriteToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToFavorite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteToUser_AB_unique" ON "_FavoriteToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteToUser_B_index" ON "_FavoriteToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToFavorite_AB_unique" ON "_EventToFavorite"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToFavorite_B_index" ON "_EventToFavorite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_eventId_key" ON "Favorite"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "_FavoriteToUser" ADD CONSTRAINT "_FavoriteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteToUser" ADD CONSTRAINT "_FavoriteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToFavorite" ADD CONSTRAINT "_EventToFavorite_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToFavorite" ADD CONSTRAINT "_EventToFavorite_B_fkey" FOREIGN KEY ("B") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
