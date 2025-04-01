"use client";

import { api } from "@/trpc/react";
import { ProductCard } from "@/components/custom/product/product-card";
import { WishlistActions } from "@/components/custom/wishlist-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link"
import Image from "next/image";
import SecondaryNavbar from "@/components/custom/secondary-navbar";


export default function WishlistPage() {
  const { data: wishlist, isLoading } = api.wishlist.getWishlist.useQuery();

  const router = useRouter();
  const utils = api.useUtils();

  // Move to cart
  const { mutate: moveToCart, isPending: isMoving } =
    api.wishlist.moveToCart.useMutation({
      onSuccess: () => {
        utils.wishlist.invalidate();
        utils.cart.invalidate();
        router.refresh();
      },
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground">
          Loading your wishlist...
        </h3>
      </div>
    );
  }

  // Empty state
  if (!wishlist?.items.length) {
    return (
      <div className="custom-layout flex flex-col items-center justify-center min-h-[90vh] p-8 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <Heart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground max-w-md mb-6 text-center">
          Items added to your wishlist will appear here. Start exploring and
          save items you love!
        </p>
        <Button
          onClick={() => router.push("/")}
          size="lg"
          className="rounded-full"
        >
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="custom-layout">
      <SecondaryNavbar pageName="Wishlist" />
      <div className="flex items-center justify-between mb-6 max-w-md mx-auto">
        <div>
          <p className="text-muted-foreground mt-1">
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {wishlist.items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => router.push("/search")}
            className="hidden sm:flex rounded-full"
          >
            Continue Shopping
          </Button>
        )}
      </div>

      <Separator className="max-w-md mx-auto mb-4 md:mb-8" />

      <div className="max-w-md mx-auto">
        <div className="lg:flex lg:gap-12">
          <div className="lg:w-full">
            {/* Product List */}
            <div className="space-y-6">
              {wishlist.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols xs:grid-cols-3 items-center gap-4 sm:gap-6 border rounded-lg  animate-fadeIn"
                >
                  {/* Image: Takes full height & width of its column */}
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative w-full h-28 sm:h-36 block"
                  >
                    <Image
                      /* @ts-ignore */
                      src={item.product?.image || "/placeholder.svg"}
                      /* @ts-ignore */
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover w-full h-full rounded-t xs:rounded-none xs:rounded-l"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between h-full">
                    <div className="px-2">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2">
                        {/* @ts-ignore */}
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <div className="text-xs sm:text-sm text-muted-foreground flex flex-col gap-1 mt-1">
                        {item.productVariationId && (
                          <>
                            <p>
                              Size:{" "}
                              <span className="font-medium">
                                {/* @ts-ignore */}
                                {item.productVariation?.size || "N/A"}
                              </span>
                            </p>
                            <p>
                              Color:{" "}
                              <span className="font-medium">
                                {/* @ts-ignore */}
                                {item.productVariation?.color || "N/A"}
                              </span>
                            </p>
                          </>
                        )}
                        {/* @ts-ignore */}
                        {item.product?.price && (
                          <p className="mt-1 text-sm font-medium text-foreground">
                            {/* @ts-ignore */}
                            रु. {item.product?.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between items-end h-full p-2 gap-2">
                    <Button
                      onClick={() =>
                        moveToCart({
                          productId: item.productId,
                          variationId: item.productVariationId as string,
                          quantity: 1,
                        })
                      }
                      disabled={isMoving}
                      size="sm"
                      className="rounded-full"
                    >
                      {isMoving ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {wishlist.items.length > 0 && (
        <div className="mt-8 flex justify-center sm:justify-end">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="sm:hidden"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
