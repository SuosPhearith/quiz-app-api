/*
  Warnings:

  - The primary key for the `Assign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Assign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quizId,userId]` on the table `Assign` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assign" DROP CONSTRAINT "Assign_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Assign_quizId_userId_key" ON "Assign"("quizId", "userId");
