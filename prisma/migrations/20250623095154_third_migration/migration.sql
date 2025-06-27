/*
  Warnings:

  - You are about to drop the column `resident_id` on the `Anouncement` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `Reminder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Ledger` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `residentId` to the `Anouncement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentId` to the `Concern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentId` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Anouncement" DROP CONSTRAINT "Anouncement_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "Billing" DROP CONSTRAINT "Billing_accountno_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_accountno_fkey";

-- DropForeignKey
ALTER TABLE "Concern" DROP CONSTRAINT "Concern_accountno_fkey";

-- DropForeignKey
ALTER TABLE "Ledger" DROP CONSTRAINT "Ledger_accountno_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_resident_id_fkey";

-- AlterTable
ALTER TABLE "Anouncement" DROP COLUMN "resident_id",
ADD COLUMN     "residentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Billing" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Concern" ADD COLUMN     "residentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ledger" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "resident_id",
ADD COLUMN     "residentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Billing_id_key" ON "Billing"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_id_key" ON "Collection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_id_key" ON "Ledger"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_id_key" ON "Resident"("id");

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("accountno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("accountno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("accountno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concern" ADD CONSTRAINT "Concern_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anouncement" ADD CONSTRAINT "Anouncement_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
