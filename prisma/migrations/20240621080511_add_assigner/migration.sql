/*
  Warnings:

  - Added the required column `assigner` to the `Assign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assign" ADD COLUMN     "assigner" TEXT NOT NULL;
