/*
  Warnings:

  - You are about to drop the column `ageRange` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `drawstring` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - Added the required column `color` to the `ProductVariation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ProductVariation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HoodieAttributes_productVariationId_size_color_hoodType_poc_idx";

-- DropIndex
DROP INDEX "JacketAttributes_productVariationId_size_color_closureType__idx";

-- DropIndex
DROP INDEX "PantAttributes_productVariationId_size_color_material_waist_idx";

-- DropIndex
DROP INDEX "ShirtAttributes_productVariationId_size_color_collarType_sl_idx";

-- DropIndex
DROP INDEX "ShoeAttributes_productVariationId_size_width_shoeType_mater_idx";

-- DropIndex
DROP INDEX "TShirtAttributes_productVariationId_size_color_sleeveType_c_idx";

-- DropIndex
DROP INDEX "UndergarmentAttributes_productVariationId_size_color_type_w_idx";

-- AlterTable
ALTER TABLE "HoodieAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "drawstring",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size",
ADD COLUMN     "drawString" TEXT;

-- AlterTable
ALTER TABLE "JacketAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "PantAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "material" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ProductVariation" ADD COLUMN     "ageRange" "AgeRange",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" DEFAULT 'UNISEX',
ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShirtAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "ShoeAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "TShirtAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "UndergarmentAttributes" DROP COLUMN "ageRange",
DROP COLUMN "color",
DROP COLUMN "gender",
DROP COLUMN "material",
DROP COLUMN "size";

-- CreateIndex
CREATE INDEX "HoodieAttributes_productVariationId_hoodType_pocketStyle_sl_idx" ON "HoodieAttributes"("productVariationId", "hoodType", "pocketStyle", "sleeveStyle", "drawString");

-- CreateIndex
CREATE INDEX "JacketAttributes_productVariationId_closureType_insulation__idx" ON "JacketAttributes"("productVariationId", "closureType", "insulation", "hooded", "pocketTypes", "waterproof", "weightClass");

-- CreateIndex
CREATE INDEX "PantAttributes_productVariationId_waistType_stretchType_leg_idx" ON "PantAttributes"("productVariationId", "waistType", "stretchType", "legStyle", "pantType");

-- CreateIndex
CREATE INDEX "ShirtAttributes_productVariationId_collarType_sleeveLength__idx" ON "ShirtAttributes"("productVariationId", "collarType", "sleeveLength", "fit", "pocketStyle", "placketType");

-- CreateIndex
CREATE INDEX "ShoeAttributes_productVariationId_width_shoeType_occasion_idx" ON "ShoeAttributes"("productVariationId", "width", "shoeType", "occasion");

-- CreateIndex
CREATE INDEX "TShirtAttributes_productVariationId_sleeveType_collarType_f_idx" ON "TShirtAttributes"("productVariationId", "sleeveType", "collarType", "fit");

-- CreateIndex
CREATE INDEX "UndergarmentAttributes_productVariationId_type_waistband_br_idx" ON "UndergarmentAttributes"("productVariationId", "type", "waistband", "breathability", "supportLevel", "legLength");
