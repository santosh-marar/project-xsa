/*
  Warnings:

  - Added the required column `fit` to the `HoodieAttributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `JacketAttributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `ShirtAttributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pattern` to the `ShirtAttributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `UndergarmentAttributes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HoodieAttributes" ADD COLUMN     "fit" TEXT NOT NULL,
ALTER COLUMN "hoodType" DROP NOT NULL,
ALTER COLUMN "fabricWeight" DROP NOT NULL,
ALTER COLUMN "sleeveStyle" DROP NOT NULL,
ALTER COLUMN "drawstring" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JacketAttributes" ADD COLUMN     "material" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShirtAttributes" ADD COLUMN     "material" TEXT NOT NULL,
ADD COLUMN     "pattern" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UndergarmentAttributes" ADD COLUMN     "material" TEXT NOT NULL;
