/*
  Warnings:

  - You are about to drop the column `brand` on the `GenericAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `GenericAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `GenericAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `HoodieAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `JacketAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `PantAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `ShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `ShoeAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `TShirtAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `modelNumber` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `UndergarmentAttributes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HoodieAttributes_productVariationId_brand_size_color_hoodTy_idx";

-- DropIndex
DROP INDEX "JacketAttributes_productVariationId_brand_size_color_closur_idx";

-- DropIndex
DROP INDEX "PantAttributes_productVariationId_brand_size_color_material_idx";

-- DropIndex
DROP INDEX "ProductCategory_name_parentId_idx";

-- DropIndex
DROP INDEX "ShirtAttributes_productVariationId_brand_size_color_collarT_idx";

-- DropIndex
DROP INDEX "ShoeAttributes_productVariationId_brand_size_width_shoeType_idx";

-- DropIndex
DROP INDEX "TShirtAttributes_productVariationId_brand_size_color_sleeve_idx";

-- DropIndex
DROP INDEX "UndergarmentAttributes_productVariationId_brand_size_color__idx";

-- AlterTable
ALTER TABLE "GenericAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty";

-- AlterTable
ALTER TABLE "HoodieAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty";

-- AlterTable
ALTER TABLE "JacketAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty",
ALTER COLUMN "insulation" DROP NOT NULL,
ALTER COLUMN "weightClass" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PantAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty",
ALTER COLUMN "waistType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT;

-- AlterTable
ALTER TABLE "ProductVariation" ADD COLUMN     "modelNumber" TEXT,
ADD COLUMN     "warranty" TEXT;

-- AlterTable
ALTER TABLE "ShirtAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty";

-- AlterTable
ALTER TABLE "ShoeAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty",
ALTER COLUMN "width" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TShirtAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty";

-- AlterTable
ALTER TABLE "UndergarmentAttributes" DROP COLUMN "brand",
DROP COLUMN "modelNumber",
DROP COLUMN "warranty",
ALTER COLUMN "breathability" DROP NOT NULL,
ALTER COLUMN "supportLevel" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "HoodieAttributes_productVariationId_size_color_hoodType_poc_idx" ON "HoodieAttributes"("productVariationId", "size", "color", "hoodType", "pocketStyle", "material", "sleeveStyle", "drawstring", "gender", "ageRange");

-- CreateIndex
CREATE INDEX "JacketAttributes_productVariationId_size_color_closureType__idx" ON "JacketAttributes"("productVariationId", "size", "color", "closureType", "insulation", "hooded", "pocketTypes", "waterproof", "weightClass", "gender", "ageRange");

-- CreateIndex
CREATE INDEX "PantAttributes_productVariationId_size_color_material_waist_idx" ON "PantAttributes"("productVariationId", "size", "color", "material", "waistType", "stretchType", "legStyle", "pantType", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "ProductCategory_name_idx" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "ShirtAttributes_productVariationId_size_color_collarType_sl_idx" ON "ShirtAttributes"("productVariationId", "size", "color", "collarType", "sleeveLength", "fit", "pocketStyle", "placketType", "gender", "ageRange");

-- CreateIndex
CREATE INDEX "ShoeAttributes_productVariationId_size_width_shoeType_mater_idx" ON "ShoeAttributes"("productVariationId", "size", "width", "shoeType", "material", "color", "occasion", "gender", "ageRange");

-- CreateIndex
CREATE INDEX "TShirtAttributes_productVariationId_size_color_sleeveType_c_idx" ON "TShirtAttributes"("productVariationId", "size", "color", "sleeveType", "collarType", "fit", "material", "gender", "ageRange");

-- CreateIndex
CREATE INDEX "UndergarmentAttributes_productVariationId_size_color_type_w_idx" ON "UndergarmentAttributes"("productVariationId", "size", "color", "type", "waistband", "breathability", "supportLevel", "legLength", "gender", "ageRange");
