-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'ESEWA', 'KHALTI');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- CreateEnum
CREATE TYPE "AgeRange" AS ENUM ('INFANT', 'TODDLER', 'KIDS', 'TEENS', 'ADULTS', 'SENIORS');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT,
    "village" TEXT,
    "street" TEXT NOT NULL,
    "zipCode" TEXT,
    "addressType" "AddressType" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subTotal" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION DEFAULT 0.0,
    "tax" DOUBLE PRECISION DEFAULT 0.0,
    "total" DOUBLE PRECISION NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TShirtAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "sleeveType" TEXT NOT NULL,
    "collarType" TEXT NOT NULL,
    "fit" TEXT NOT NULL,
    "fabricWeight" TEXT,
    "careInstructions" TEXT,
    "stretchability" TEXT,
    "pattern" TEXT,

    CONSTRAINT "TShirtAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "waistType" TEXT,
    "stretchType" TEXT NOT NULL,
    "washType" TEXT NOT NULL,
    "legStyle" TEXT NOT NULL,
    "pantType" TEXT NOT NULL,
    "inseam" INTEGER,
    "pocketTypes" TEXT[],

    CONSTRAINT "PantAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoeAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "width" TEXT,
    "shoeType" TEXT NOT NULL,
    "closureType" TEXT NOT NULL,
    "outsole" TEXT,
    "insole" TEXT,
    "occasion" TEXT NOT NULL,

    CONSTRAINT "ShoeAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShirtAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "collarType" TEXT NOT NULL,
    "sleeveLength" TEXT NOT NULL,
    "fit" TEXT NOT NULL,
    "pocketStyle" TEXT NOT NULL,
    "placketType" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,

    CONSTRAINT "ShirtAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JacketAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "closureType" TEXT NOT NULL,
    "insulation" TEXT,
    "hooded" BOOLEAN NOT NULL,
    "pocketTypes" TEXT[],
    "waterproof" BOOLEAN NOT NULL,
    "weightClass" TEXT,

    CONSTRAINT "JacketAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoodieAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "fit" TEXT NOT NULL,
    "hoodType" TEXT,
    "pocketStyle" TEXT NOT NULL,
    "fabricWeight" TEXT,
    "sleeveStyle" TEXT,
    "drawString" TEXT,

    CONSTRAINT "HoodieAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UndergarmentAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "waistband" TEXT NOT NULL,
    "breathability" TEXT,
    "supportLevel" TEXT,
    "legLength" TEXT NOT NULL,

    CONSTRAINT "UndergarmentAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericAttributes" (
    "id" TEXT NOT NULL,
    "productVariationId" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,

    CONSTRAINT "GenericAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "brand" TEXT DEFAULT '',
    "material" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "gender" "Gender" DEFAULT 'UNISEX',
    "ageRange" "AgeRange",
    "modelNumber" TEXT,
    "warranty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT[],

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shopCategoryId" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopReview" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_userId_city_village_idx" ON "Address"("userId", "city", "village");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productVariationId_key" ON "CartItem"("cartId", "productVariationId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TShirtAttributes_productVariationId_key" ON "TShirtAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "TShirtAttributes_productVariationId_sleeveType_collarType_f_idx" ON "TShirtAttributes"("productVariationId", "sleeveType", "collarType", "fit");

-- CreateIndex
CREATE UNIQUE INDEX "PantAttributes_productVariationId_key" ON "PantAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "PantAttributes_productVariationId_waistType_stretchType_leg_idx" ON "PantAttributes"("productVariationId", "waistType", "stretchType", "legStyle", "pantType");

-- CreateIndex
CREATE UNIQUE INDEX "ShoeAttributes_productVariationId_key" ON "ShoeAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "ShoeAttributes_productVariationId_width_shoeType_occasion_idx" ON "ShoeAttributes"("productVariationId", "width", "shoeType", "occasion");

-- CreateIndex
CREATE UNIQUE INDEX "ShirtAttributes_productVariationId_key" ON "ShirtAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "ShirtAttributes_productVariationId_collarType_sleeveLength__idx" ON "ShirtAttributes"("productVariationId", "collarType", "sleeveLength", "fit", "pocketStyle", "placketType");

-- CreateIndex
CREATE UNIQUE INDEX "JacketAttributes_productVariationId_key" ON "JacketAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "JacketAttributes_productVariationId_closureType_insulation__idx" ON "JacketAttributes"("productVariationId", "closureType", "insulation", "hooded", "pocketTypes", "waterproof", "weightClass");

-- CreateIndex
CREATE UNIQUE INDEX "HoodieAttributes_productVariationId_key" ON "HoodieAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "HoodieAttributes_productVariationId_hoodType_pocketStyle_sl_idx" ON "HoodieAttributes"("productVariationId", "hoodType", "pocketStyle", "sleeveStyle", "drawString");

-- CreateIndex
CREATE UNIQUE INDEX "UndergarmentAttributes_productVariationId_key" ON "UndergarmentAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "UndergarmentAttributes_productVariationId_type_waistband_br_idx" ON "UndergarmentAttributes"("productVariationId", "type", "waistband", "breathability", "supportLevel", "legLength");

-- CreateIndex
CREATE UNIQUE INDEX "GenericAttributes_productVariationId_key" ON "GenericAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "GenericAttributes_productVariationId_idx" ON "GenericAttributes"("productVariationId");

-- CreateIndex
CREATE INDEX "Product_name_categoryId_shopId_idx" ON "Product"("name", "categoryId", "shopId");

-- CreateIndex
CREATE INDEX "ProductVariation_productId_price_createdAt_idx" ON "ProductVariation"("productId", "price", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "ProductCategory_name_idx" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "Shop_name_idx" ON "Shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShopCategory_name_key" ON "ShopCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShopReview_shopId_userId_key" ON "ShopReview"("shopId", "userId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productVariationId_fkey" FOREIGN KEY ("productVariationId") REFERENCES "ProductVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopCategoryId_fkey" FOREIGN KEY ("shopCategoryId") REFERENCES "ShopCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopReview" ADD CONSTRAINT "ShopReview_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopReview" ADD CONSTRAINT "ShopReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
