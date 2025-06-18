/*
  Warnings:

  - You are about to drop the column `created_at` on the `Anouncement` table. All the data in the column will be lost.
  - You are about to drop the column `billamt` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `arrearsamnt` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `othrappy` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Concern` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `Concern` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Coordinate` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `Ledger` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the `faq` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `billamnt` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentFee` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrearsamt` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `othrapply` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountno` to the `Concern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Billing" DROP CONSTRAINT "Billing_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "Concern" DROP CONSTRAINT "Concern_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "Ledger" DROP CONSTRAINT "Ledger_resident_id_fkey";

-- AlterTable
ALTER TABLE "Anouncement" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Billing" DROP COLUMN "billamt",
DROP COLUMN "created_at",
DROP COLUMN "resident_id",
ADD COLUMN     "billamnt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "environmentFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentDate" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ALTER COLUMN "totalBill" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "arrearsamnt",
DROP COLUMN "created_at",
DROP COLUMN "othrappy",
DROP COLUMN "resident_id",
ADD COLUMN     "arrearsamt" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "othrapply" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Concern" DROP COLUMN "created_at",
DROP COLUMN "resident_id",
ADD COLUMN     "accountno" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Coordinate" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "created_at",
DROP COLUMN "resident_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "created_at",
ADD COLUMN     "book" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "faq";

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concern" ADD CONSTRAINT "Concern_accountno_fkey" FOREIGN KEY ("accountno") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
