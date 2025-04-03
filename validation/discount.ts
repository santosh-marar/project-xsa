import { z } from "zod";
import { DiscountType, DiscountScope } from "@prisma/client";

export const createDiscountSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  discountType: z.enum([
    DiscountType.PERCENTAGE,
    DiscountType.FIXED_AMOUNT,
    DiscountType.BUY_X_GET_Y,
  ]),
  discountScope: z.enum([
    DiscountScope.PRODUCT,
    DiscountScope.CATEGORY,
    DiscountScope.SHOP,
    DiscountScope.CART,
  ]),
  value: z.number(),
  minPurchase: z.number().optional(),
  minItems: z.number().optional(),
  usageLimit: z.number().optional(),
  endDate: z.date().optional(),
  allowStacking: z.boolean().optional(),
  priority: z.number().optional(),
  buyQuantity: z.number().optional(),
  getQuantity: z.number().optional(),
  appliedToProductId: z.string().optional(),
  autoApply: z.boolean().optional(),
});

export type CreateDiscountSchema = z.infer<typeof createDiscountSchema>;

