-- DropForeignKey
ALTER TABLE "ProductVariationDiscount" DROP CONSTRAINT "ProductVariationDiscount_variationId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "discountPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "shopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductVariationDiscount" ADD CONSTRAINT "ProductVariationDiscount_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
