import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { WishlistActions } from "../wishlist-button";
// Define the type for the product category object
interface ProductCategory {
  createdAt: Date;        
  description: string;     
  id: string;              
  name: string;            
  parentId: string | null;        
  updatedAt: Date;         
}

interface ProductVariation {
  id: string;
  ageRange?: string | null;
  color?: string;
  gender?: string | null;
  image: string[];
  price: number;
  discountPrice: number;
  size: string;
  stock: number;
}

// Define the main product type
interface ProductCardProps {
  brand: string | null; // e.g., "gucci"
  categoryId: string; // e.g., "01JK36TRCBBEP76BHH0MH5G40G"
  createdAt: Date; // e.g., Sat Feb 08 2025 07:19:23 GMT+0545 (Nepal Time)
  description: string; // e.g., "very good shoes"
  id: string; // e.g., "01JKHK33EABBJM7P102TY900B3"
  image: string; // e.g., "https://project-xsa.s3.amazonaws.com/product-images/..."
  material: string | null; // e.g., "plastic"
  name: string; // e.g., "ccki"
  productCategory: ProductCategory; // Nested object with product category details
  productVariations: ProductVariation[]; // Array of variations (each with its own type)
  shopId: string; // e.g., "01JJXZ4VF6D92PG12YXV8KVY8Z"
  updatedAt: Date; // e.g., Sat Feb 08 2025 07:19:23 GMT+0545 (Nepal Time)
}

// Calculate discount for any variation that has both price and discountPrice
export const calculateDiscount = (variation: any) => {
  if (variation?.price && variation?.discountPrice) {
    return Math.round(
      ((variation.price - variation.discountPrice) / variation.price) * 100
    );
  }
  return 0;
};

export function ProductCard({
  brand,
  categoryId,
  createdAt,
  description,
  id,
  image,
  material,
  name,
  productCategory,
  productVariations,
  shopId,
  updatedAt,
}: ProductCardProps) {
  // Find the maximum discount across all variations
  const getMaxDiscount = (variations: ProductVariation[]) => {
    if (!variations || variations.length === 0) return 0;

    const discounts = variations.map((variation) =>
      calculateDiscount(variation)
    );
    return Math.max(...discounts);
  };

  // Use this in your component
  const discount = getMaxDiscount(productVariations);

  return (
    // Wrap the whole card in a Link that navigates to /product/:id
    <Link href={`/product/${id}`} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        )}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={image || "/placeholder.svg"}
            alt={name || "Product Image"}
            width={400}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Only show if product has variations */}
          {productVariations?.length > 0 && (
            <WishlistActions
              productId={id}
              variationId={productVariations[0]?.id}
            />
          )}{" "}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              {name}
            </h3>
            <span className="text-xs font-medium text-gray-500">{brand}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex ">
              {/* Find a variation with discount to display */}
              {(() => {
                // Find first variation with discount
                const discountedVariation = productVariations.find(
                  (v) => v?.discountPrice
                );

                if (discountedVariation) {
                  return (
                    <div className="flex items-end gap-2">
                      <span className="text-sm font-semibold text-primary">
                        रु. {discountedVariation.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-primary/70 line-through">
                        रु. {discountedVariation.price.toFixed(2)}
                      </span>
                    </div>
                  );
                } else {
                  // No discounted variation found, show regular price
                  return (
                    <span className="text-sm font-semibold text-primary">
                      रु. {productVariations[0]?.price}
                    </span>
                  );
                }
              })()}
            </div>
            {/* {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating}</span>
                {reviews && (
                  <span className="text-xs text-gray-500">({reviews})</span>
                )}
              </div>
            )} */}
          </div>
          {/* <div className="flex items-center justify-between pt-2 border-t border-gray-100">
           <Button variant="outline" size="sm" className="text-xs">
             Add to cart
           </Button>
         </div> */}
        </div>
        {discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-destructive">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
