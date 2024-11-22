/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `answers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content]` on the table `questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "answers_content_key" ON "answers"("content");

-- CreateIndex
CREATE UNIQUE INDEX "questions_content_key" ON "questions"("content");
