/*
  Warnings:

  - You are about to drop the column `category` on the `EstablishmentCategory` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `EventCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[establishmentId,category_id]` on the table `EstablishmentCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,category_id]` on the table `EventCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `EstablishmentCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `EventCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EstablishmentCategory_establishmentId_category_key";

-- DropIndex
DROP INDEX "EventCategory_eventId_category_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EstablishmentCategory" DROP COLUMN "category",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventCategory" DROP COLUMN "category",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "CategoryType";

-- CreateIndex
CREATE UNIQUE INDEX "EstablishmentCategory_establishmentId_category_id_key" ON "EstablishmentCategory"("establishmentId", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_eventId_category_id_key" ON "EventCategory"("eventId", "category_id");

-- AddForeignKey
ALTER TABLE "EstablishmentCategory" ADD CONSTRAINT "EstablishmentCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCategory" ADD CONSTRAINT "EventCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
