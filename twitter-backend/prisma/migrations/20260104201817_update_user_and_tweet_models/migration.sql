/*
  Warnings:

  - You are about to drop the column `author_id` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the `_ReTweets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_author_id_fkey";

-- DropForeignKey
ALTER TABLE "_ReTweets" DROP CONSTRAINT "_ReTweets_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReTweets" DROP CONSTRAINT "_ReTweets_B_fkey";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "author_id",
ADD COLUMN     "authorId" INTEGER,
ADD COLUMN     "retweetOfId" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "_ReTweets";

-- CreateIndex
CREATE INDEX "Tweet_retweetOfId_idx" ON "Tweet"("retweetOfId");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_retweetOfId_fkey" FOREIGN KEY ("retweetOfId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
