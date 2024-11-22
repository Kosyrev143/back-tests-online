/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `tests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tests_title_key" ON "tests"("title");
