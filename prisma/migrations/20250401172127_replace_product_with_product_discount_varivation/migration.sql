/*
  Warnings:

  - You are about to drop the `ProductDiscount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_discountId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_productId_fkey";

-- AlterTable
ALTER TABLE "ProductVariation" ADD COLUMN     "discountPrice" DOUBLE PRECISION;

-- DropTable
DROP TABLE "ProductDiscount";

-- CreateTable
CREATE TABLE "ProductVariationDiscount" (
    "id" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "ProductVariationDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariationDiscount_variationId_discountId_key" ON "ProductVariationDiscount"("variationId", "discountId");

-- AddForeignKey
ALTER TABLE "ProductVariationDiscount" ADD CONSTRAINT "ProductVariationDiscount_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "ProductVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariationDiscount" ADD CONSTRAINT "ProductVariationDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
