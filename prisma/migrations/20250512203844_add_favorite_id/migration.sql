/*
  Warnings:

  - You are about to drop the column `eventId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the `_EventToFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoriteToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,event_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `profileType` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_EventToFavorite" DROP CONSTRAINT "_EventToFavorite_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToFavorite" DROP CONSTRAINT "_EventToFavorite_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteToUser" DROP CONSTRAINT "_FavoriteToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoriteToUser" DROP CONSTRAINT "_FavoriteToUser_B_fkey";

-- DropIndex
DROP INDEX "Favorite_userId_eventId_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileType",
ADD COLUMN     "profileType" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_EventToFavorite";

-- DropTable
DROP TABLE "_FavoriteToUser";

-- DropEnum
DROP TYPE "UserProfileType";

-- DropEnum
DROP TYPE "UserRoleEnum";

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_event_id_key" ON "Favorite"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
