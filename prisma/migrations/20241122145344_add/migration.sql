-- CreateTable
CREATE TABLE "result_answers" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "result_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "result_answers_resultId_answerId_key" ON "result_answers"("resultId", "answerId");

-- AddForeignKey
ALTER TABLE "result_answers" ADD CONSTRAINT "result_answers_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_answers" ADD CONSTRAINT "result_answers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
