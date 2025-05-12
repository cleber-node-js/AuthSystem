/*
  Warnings:

  - You are about to drop the column `primaryOwnerId` on the `establishments` table. All the data in the column will be lost.
  - Added the required column `primaryOwner_id` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "establishments" DROP CONSTRAINT "establishments_primaryOwnerId_fkey";

-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "primaryOwnerId",
ADD COLUMN     "primaryOwner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "establishments" ADD CONSTRAINT "establishments_primaryOwner_id_fkey" FOREIGN KEY ("primaryOwner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
