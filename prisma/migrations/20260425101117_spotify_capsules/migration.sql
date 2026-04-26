/*
  Warnings:

  - You are about to drop the column `song` on the `StoryCapsule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StoryCapsule" DROP COLUMN "song",
ADD COLUMN     "albumArt" TEXT,
ADD COLUMN     "artist" TEXT,
ADD COLUMN     "previewUrl" TEXT,
ADD COLUMN     "songTitle" TEXT,
ADD COLUMN     "spotifyUrl" TEXT;
