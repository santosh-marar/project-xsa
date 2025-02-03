import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { shopRouter } from "./routers/shop/shop";
import { userRouter } from "./routers/user";
import { imageRouter } from "./routers/image";
import { shopCategoryRouter } from "./routers/shop/shop-category";
import productCategoryRouter from "./routers/product/category";
import productRouter from "./routers/product/product";
import productVariationRouter from "./routers/product/variation";
import { productAttributesRouter } from "./routers/product/attribute";

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  shopCategory: shopCategoryRouter,
  shop: shopRouter,
  user: userRouter,
  image: imageRouter,
  productCategory: productCategoryRouter,
  product: productRouter,
  productVariation: productVariationRouter,
  productAttribute: productAttributesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
