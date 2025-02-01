/*
  Warnings:

  - A unique constraint covering the columns `[shopId,userId]` on the table `ShopReview` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductCategory_name_idx";

-- DropIndex
DROP INDEX "ProductCategory_name_key";

-- CreateIndex
CREATE INDEX "ProductCategory_name_parentId_idx" ON "ProductCategory"("name", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopReview_shopId_userId_key" ON "ShopReview"("shopId", "userId");
