-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('INFANT', 'TODDLER', 'KIDS', 'TEENS', 'ADULTS', 'SENIORS');

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TShirtAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sleeveType" TEXT NOT NULL,
    "collarType" TEXT NOT NULL,
    "fit" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "fabricWeight" TEXT,
    "careInstructions" TEXT,
    "stretchability" TEXT,
    "pattern" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "TShirtAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "waistType" TEXT NOT NULL,
    "stretchType" TEXT NOT NULL,
    "washType" TEXT NOT NULL,
    "legStyle" TEXT NOT NULL,
    "pantType" TEXT NOT NULL,
    "inseam" INTEGER,
    "pocketTypes" TEXT[],
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "PantAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoeAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "shoeType" TEXT NOT NULL,
    "closureType" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "outsole" TEXT,
    "insole" TEXT,
    "occasion" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "ShoeAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShirtAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "collarType" TEXT NOT NULL,
    "sleeveLength" TEXT NOT NULL,
    "fit" TEXT NOT NULL,
    "pocketStyle" TEXT NOT NULL,
    "placketType" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "ShirtAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JacketAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "closureType" TEXT NOT NULL,
    "insulation" TEXT NOT NULL,
    "hooded" BOOLEAN NOT NULL,
    "pocketTypes" TEXT[],
    "waterproof" BOOLEAN NOT NULL,
    "weightClass" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "JacketAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoodieAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "hoodType" TEXT NOT NULL,
    "pocketStyle" TEXT NOT NULL,
    "fabricWeight" TEXT NOT NULL,
    "sleeveStyle" TEXT NOT NULL,
    "drawstring" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNISEX',
    "ageRange" "AgeRange",

    CONSTRAINT "HoodieAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UndergarmentAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "waistband" TEXT NOT NULL,
    "breathability" TEXT NOT NULL,
    "supportLevel" TEXT NOT NULL,
    "legLength" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "ageRange" "AgeRange" NOT NULL,

    CONSTRAINT "UndergarmentAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "brand" TEXT,
    "modelNumber" TEXT,
    "warranty" TEXT,

    CONSTRAINT "GenericAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT[],

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TShirtAttributes_productVariationId_key" ON "TShirtAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "TShirtAttributes_productVariationId_brand_size_color_sleeve_idx" ON "TShirtAttributes"("productVariationId", "brand", "size", "color", "sleeveType", "collarType", "fit", "material", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "PantAttributes_productVariationId_key" ON "PantAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "PantAttributes_productVariationId_brand_size_color_material_idx" ON "PantAttributes"("productVariationId", "brand", "size", "color", "material", "waistType", "stretchType", "legStyle", "pantType", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "ShoeAttributes_productVariationId_key" ON "ShoeAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "ShoeAttributes_productVariationId_brand_size_width_shoeType_idx" ON "ShoeAttributes"("productVariationId", "brand", "size", "width", "shoeType", "material", "color", "occasion", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "ShirtAttributes_productVariationId_key" ON "ShirtAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "ShirtAttributes_productVariationId_brand_size_color_collarT_idx" ON "ShirtAttributes"("productVariationId", "brand", "size", "color", "collarType", "sleeveLength", "fit", "pocketStyle", "placketType", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "JacketAttributes_productVariationId_key" ON "JacketAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "JacketAttributes_productVariationId_brand_size_color_closur_idx" ON "JacketAttributes"("productVariationId", "brand", "size", "color", "closureType", "insulation", "hooded", "pocketTypes", "waterproof", "weightClass", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "HoodieAttributes_productVariationId_key" ON "HoodieAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "HoodieAttributes_productVariationId_brand_size_color_hoodTy_idx" ON "HoodieAttributes"("productVariationId", "brand", "size", "color", "hoodType", "pocketStyle", "material", "sleeveStyle", "drawstring", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "UndergarmentAttributes_productVariationId_key" ON "UndergarmentAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "UndergarmentAttributes_productVariationId_brand_size_color__idx" ON "UndergarmentAttributes"("productVariationId", "brand", "size", "color", "type", "waistband", "breathability", "supportLevel", "legLength", "gender", "ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "GenericAttributes_productVariationId_key" ON "GenericAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "GenericAttributes_productVariationId_idx" ON "GenericAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "ProductVariation_productId_price_createdAt_idx" ON "ProductVariation"("productId", "price", "createdAt");

-- AddForeignKey
ALTER TABLE "TShirtAttributes" ADD CONSTRAINT "TShirtAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantAttributes" ADD CONSTRAINT "PantAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoeAttributes" ADD CONSTRAINT "ShoeAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShirtAttributes" ADD CONSTRAINT "ShirtAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JacketAttributes" ADD CONSTRAINT "JacketAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoodieAttributes" ADD CONSTRAINT "HoodieAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UndergarmentAttributes" ADD CONSTRAINT "UndergarmentAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenericAttributes" ADD CONSTRAINT "GenericAttributes_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
