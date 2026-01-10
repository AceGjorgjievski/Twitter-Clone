-- DropIndex
DROP INDEX "User_slug_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "slug" DROP DEFAULT;
