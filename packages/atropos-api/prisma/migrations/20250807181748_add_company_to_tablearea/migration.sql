/*
  Warnings:

  - Added the required column `companyId` to the `TableArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CourierLocation" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';

-- AlterTable
ALTER TABLE "public"."TableArea" ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TableArea_companyId_idx" ON "public"."TableArea"("companyId");

-- AddForeignKey
ALTER TABLE "public"."TableArea" ADD CONSTRAINT "TableArea_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
