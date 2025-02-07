import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface ProductCardProps {
  id: string; // Added product id
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  imageUrl: string;
  className?: string;
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  rating,
  reviews,
  imageUrl,
  className,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    // Wrap the whole card in a Link that navigates to /product/:id
    <Link href={`/product/${id}`} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          className
        )}
      >
        <div className="relative aspect-square overflow-hidden rounded bg-gray-100">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={400}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* The heart button—prevent its click from propagating to the Link */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              // Handle "favorite" logic here, if needed
            }}
            className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button> */}
        </div>
        <div className="space-y-1 p-3">
          <h3 className="text-sm font-medium text-gray-700 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating}</span>
                {reviews && (
                  <span className="text-xs text-gray-500">({reviews})</span>
                )}
              </div>
            )}
          </div>
          {/* <Button variant="outline" size="sm">
            Add to cart
          </Button> */}
        </div>
        {/* {discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-destructive">
              {discount}% OFF
            </span>
          </div>
        )} */}
      </div>
    </Link>
  );
}
