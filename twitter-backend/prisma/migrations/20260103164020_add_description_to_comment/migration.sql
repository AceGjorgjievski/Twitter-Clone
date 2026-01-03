/*
  Warnings:

  - Added the required column `description` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "description" VARCHAR(280) NOT NULL;
