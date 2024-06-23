-- AlterTable
ALTER TABLE "Assign" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Assign_pkey" PRIMARY KEY ("id");
