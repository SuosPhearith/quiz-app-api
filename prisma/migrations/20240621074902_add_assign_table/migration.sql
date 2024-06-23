-- CreateTable
CREATE TABLE "Assign" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Assign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assign" ADD CONSTRAINT "Assign_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assign" ADD CONSTRAINT "Assign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
