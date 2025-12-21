/*
  Warnings:

  - You are about to drop the column `discountPrice` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "discountPrice",
DROP COLUMN "price",
ADD COLUMN     "totalDiscountPrice" DOUBLE PRECISION;
