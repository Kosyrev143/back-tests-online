/*
  Warnings:

  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_testId_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_userId_fkey";

-- DropForeignKey
ALTER TABLE "test_tags" DROP CONSTRAINT "test_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "test_tags" DROP CONSTRAINT "test_tags_testId_fkey";

-- DropTable
DROP TABLE "feedbacks";

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "test_tags";
