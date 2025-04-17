/*
  Warnings:

  - The `status` column on the `Artist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "status",
ADD COLUMN     "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING';
