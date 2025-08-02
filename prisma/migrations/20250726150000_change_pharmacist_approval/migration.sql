-- AlterTable
ALTER TABLE "Pharmacist" DROP COLUMN IF EXISTS "approvedAt";
ALTER TABLE "Pharmacist" ADD COLUMN     "approval" TEXT;
