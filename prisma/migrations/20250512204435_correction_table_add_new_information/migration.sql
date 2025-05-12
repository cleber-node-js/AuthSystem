/*
  Warnings:

  - You are about to drop the column `eventId` on the `Classification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Classification` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `EstablishmentCategory` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `EventCategory` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserPreference` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserVerificationToken` table. All the data in the column will be lost.
  - The primary key for the `establishment_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artistId` on the `establishment_artists` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `establishment_artists` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the `_UserVerificationTokenToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[establishment_id,category_id]` on the table `EstablishmentCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,category_id]` on the table `EventCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `UserVerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Classification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Classification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_id` to the `EstablishmentCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `EventCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `transaction_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `UserPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserVerificationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artist_id` to the `establishment_artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_id` to the `establishment_artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_userId_fkey";

-- DropForeignKey
ALTER TABLE "EstablishmentCategory" DROP CONSTRAINT "EstablishmentCategory_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "EventCategory" DROP CONSTRAINT "EventCategory_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVerificationToken" DROP CONSTRAINT "UserVerificationToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserVerificationTokenToUser" DROP CONSTRAINT "_UserVerificationTokenToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserVerificationTokenToUser" DROP CONSTRAINT "_UserVerificationTokenToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "establishment_artists" DROP CONSTRAINT "establishment_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "establishment_artists" DROP CONSTRAINT "establishment_artists_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_userId_fkey";

-- DropIndex
DROP INDEX "EstablishmentCategory_establishmentId_category_id_key";

-- DropIndex
DROP INDEX "EventCategory_eventId_category_id_key";

-- DropIndex
DROP INDEX "Transaction_transactionId_key";

-- DropIndex
DROP INDEX "UserVerificationToken_userId_key";

-- DropIndex
DROP INDEX "user_roles_userId_roleId_key";

-- AlterTable
ALTER TABLE "Classification" DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EstablishmentCategory" DROP COLUMN "establishmentId",
ADD COLUMN     "establishment_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "establishmentId",
ADD COLUMN     "establishment_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventCategory" DROP COLUMN "eventId",
ADD COLUMN     "event_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "artistId",
DROP COLUMN "establishmentId",
DROP COLUMN "userId",
ADD COLUMN     "artist_id" INTEGER,
ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "artistId",
DROP COLUMN "establishmentId",
DROP COLUMN "userId",
ADD COLUMN     "artist_id" INTEGER,
ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "artistId",
DROP COLUMN "establishmentId",
DROP COLUMN "subscriptionId",
DROP COLUMN "transactionId",
DROP COLUMN "userId",
ADD COLUMN     "artist_id" INTEGER,
ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "subscription_id" INTEGER,
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "UserPreference" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserVerificationToken" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "establishment_artists" DROP CONSTRAINT "establishment_artists_pkey",
DROP COLUMN "artistId",
DROP COLUMN "establishmentId",
ADD COLUMN     "artist_id" INTEGER NOT NULL,
ADD COLUMN     "establishment_id" INTEGER NOT NULL,
ADD CONSTRAINT "establishment_artists_pkey" PRIMARY KEY ("artist_id", "establishment_id");

-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "roleId",
DROP COLUMN "userId",
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserVerificationTokenToUser";

-- CreateIndex
CREATE UNIQUE INDEX "EstablishmentCategory_establishment_id_category_id_key" ON "EstablishmentCategory"("establishment_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_event_id_category_id_key" ON "EventCategory"("event_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationToken_user_id_key" ON "UserVerificationToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "EstablishmentCategory" ADD CONSTRAINT "EstablishmentCategory_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCategory" ADD CONSTRAINT "EventCategory_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerificationToken" ADD CONSTRAINT "UserVerificationToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_artists" ADD CONSTRAINT "establishment_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_artists" ADD CONSTRAINT "establishment_artists_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
