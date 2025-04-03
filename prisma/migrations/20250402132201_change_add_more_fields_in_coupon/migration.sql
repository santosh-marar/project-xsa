-- CreateEnum
CREATE TYPE "CustomerEligibility" AS ENUM ('ALL_CUSTOMERS', 'NEW_CUSTOMERS', 'RETURNING_CUSTOMERS', 'HIGH_VALUE', 'SEGMENT_SPECIFIC');

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "customerEligibility" "CustomerEligibility",
ADD COLUMN     "minOrderValue" DOUBLE PRECISION,
ADD COLUMN     "perUserLimit" INTEGER;

-- AlterTable
ALTER TABLE "CouponUsage" ADD COLUMN     "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "maxDiscountValue" INTEGER;

-- CreateTable
CREATE TABLE "CouponCustomer" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CouponCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CouponCustomer_couponId_userId_key" ON "CouponCustomer"("couponId", "userId");

-- CreateIndex
CREATE INDEX "Coupon_code_isActive_startDate_endDate_idx" ON "Coupon"("code", "isActive", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "CouponUsage_userId_idx" ON "CouponUsage"("userId");

-- AddForeignKey
ALTER TABLE "CouponCustomer" ADD CONSTRAINT "CouponCustomer_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponCustomer" ADD CONSTRAINT "CouponCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
