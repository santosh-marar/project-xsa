import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  color?: string ;
  gender?: string | null;
  image: string[];         
  price: number;          
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
  // const discount = originalPrice
  //   ? Math.round(((originalPrice - price) / originalPrice) * 100)
  //   : 0;


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
       <div className="space-y-2 p-4">
         <div className="flex items-start justify-between">
           <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
             {name}
           </h3>
           <span className="text-xs font-medium text-gray-500">{brand}</span>
         </div>
         <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
         <div className="flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-primary">
               {/* {productVariations[0].price}  */}
             </span>
             {/* {originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                 रु.{originalPrice}
                </span>
              )} */}
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
