/*
  Warnings:

  - You are about to drop the column `questionId` on the `Result` table. All the data in the column will be lost.
  - Added the required column `isPass` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "questionId",
ADD COLUMN     "isPass" BOOLEAN NOT NULL;
