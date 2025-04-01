"use client";

import { Heart, HeartOff, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export function WishlistActions({
  productId,
  variationId,
}: {
  productId: string;
  variationId?: string | null; 
}) {
  const router = useRouter();
  const utils = api.useUtils();

  // Prevent event bubbling to parent links
  const handleAction = (e: MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  // Toggle wishlist
  const { mutate: toggleWishlist, isPending: isToggling } =
    api.wishlist.toggleItem.useMutation({
      onSuccess: () => {
        utils.wishlist.invalidate();
      },
    });

  // Move to cart
  const { mutate: moveToCart, isPending: isMoving } =
    api.wishlist.moveToCart.useMutation({
      onSuccess: () => {
        utils.wishlist.invalidate();
        utils.cart.invalidate();
        router.refresh();
      },
    });

  // Check if item is in wishlist
  const { data: wishlist } = api.wishlist.getWishlist.useQuery();
  const isInWishlist = wishlist?.items.some(
    (item) =>
      item.productId === productId &&
      item.productVariationId === (variationId || null)
  );

  // Don't render if no variation exists but product requires one
  if (variationId === undefined) return null;

  return (
    <div
      className="absolute right-2 top-2 rounded-full bg-secondary p-1 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Wishlist toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) =>
          handleAction(e, () =>
            toggleWishlist({ productId, variationId: variationId || undefined })
          )
        }
        disabled={isToggling}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <Heart className="h-6 w-6 text-destructive fill-destructive" />
        ) : (
          <Heart className="h-6 w-6" />
        )}
      </Button>

      {/* Move to cart button (only shows if in wishlist) */}
      {isInWishlist && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) =>
            handleAction(e, () =>
              moveToCart({
                productId,
                variationId: variationId || undefined,
                quantity: 1,
              })
            )
          }
          disabled={isMoving}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}