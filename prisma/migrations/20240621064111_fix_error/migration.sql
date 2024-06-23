/*
  Warnings:

  - You are about to drop the column `answerId` on the `Question` table. All the data in the column will be lost.
  - Made the column `questionId` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionId` on table `Option` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "questionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "questionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answerId";

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
