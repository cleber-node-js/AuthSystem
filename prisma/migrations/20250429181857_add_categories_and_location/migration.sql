-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('FOOD', 'DRINK', 'MUSIC', 'DANCE', 'ART', 'CULTURE', 'OTHER');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "EstablishmentCategory" (
    "id" SERIAL NOT NULL,
    "establishmentId" INTEGER NOT NULL,
    "category" "CategoryType" NOT NULL,

    CONSTRAINT "EstablishmentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "category" "CategoryType" NOT NULL,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EstablishmentCategory_establishmentId_category_key" ON "EstablishmentCategory"("establishmentId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_eventId_category_key" ON "EventCategory"("eventId", "category");

-- AddForeignKey
ALTER TABLE "EstablishmentCategory" ADD CONSTRAINT "EstablishmentCategory_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCategory" ADD CONSTRAINT "EventCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
