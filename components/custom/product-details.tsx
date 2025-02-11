"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageGallery } from "./product-image-gallery";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { DesktopNavbar } from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";
import useBack from "@/hooks/use-back";

interface BaseAttributes {
  id: string;
  productVariationId: string;
}

interface TShirtAttributes extends BaseAttributes {
  sleeveType: string; // "long" | "short" | "3/4" | "full" | "none"
  collarType: string; // "round" | "v-neck" | "polo" | "square" | "none"
  fit: string; // "regular" | "slim" | "oversized"
  fabricWeight?: string; // "light" | "medium" | "heavy" | "very heavy"
  careInstructions?: string;
  stretchability?: string; // "non-stretch" | "little-stretch" | "medium-stretch" | "super-stretch" | "other"
  pattern?: string; // "solid" | "striped" | "printed" | "logo-only" | "back-printed-only" | "front-printed-only" | "other"
}

interface PantAttributes extends BaseAttributes {
  waistType?: string; // "low" | "mid" | "high", "others"
  stretchType: string; // "non-stretch" | "little-stretch" | "medium-stretch" | "super-stretch" | "other"
  washType: string; // "dark-wash" | "medium-wash" | "distressed" | "other"
  legStyle: string; // "skinny" | "slim" |"straight" | "regular" | "bootcut" | "wide" | "other"
  pantType: string; // "full pant" | "half pant" | "low-pant" | "3/4" | "other"
  inseam?: number; // In inches (28, 30, 32)
  pocketTypes: string[]; // ["front", "back", "coin"]
}

interface ShoeAttributes extends BaseAttributes {
  width?: string; // "narrow" | "medium" | "wide"
  shoeType: string; // "sneakers" | "boots" | "sandals" | "sport" | "dress-shoes" | "loafers" | "flats" | "ankle-boots" | "ballet-flats" | "slipper" | "sandals" | "formal-shoes" | "other"
  closureType: string; // "laces" | "velcro" | "slip-on" | "buckle" | "zipper" | "none"
  outsole?: string; // "rubber" | "eva" | "tup" | "leather" | "other" | "none"
  insole?: string; // "memory foam" | "ortholite" |"other" | "none"
  occasion: string; // "casual" | "sports" | "formal"
}

interface ShirtAttributes extends BaseAttributes {
  collarType: string; // "spread" | "button-down" | "mandarin" | "wing" | "club" | "other" | "none"
  sleeveLength: string; // "short" | "half" | "long" | "full" | "none" | "3/4"
  fit: string; // "slim" | "regular" | "relaxed" | "oversized" | "loose" | "other"
  pocketStyle: string; // "chest" | "no pockets"
  placketType: string; // "hidden" | "buttoned"
  pattern: string; // "solid" | "striped" | "checked" | "printed" | "logo-only" | "back-printed-only" | "front-printed-only" | "other"
}

interface JacketAttributes extends BaseAttributes {
  closureType: string; // "zipper" | "buttons" | "snap" | "none"
  insulation?: string; // "down" | "synthetic" | "fleece" | "none"
  hooded: boolean;
  pocketTypes: string[]; // chest | side | interior
  waterproof: boolean;
  weightClass?: string; // "light" | "medium" | "heavy" | "very heavy"
}

interface HoodieAttributes extends BaseAttributes {
  fit: string; // "regular" | "slim" | "oversized"
  hoodType?: string; // "fitted" | "adjustable" | "oversized"
  pocketStyle: string; // "kangaroo" | "zippered" | "split"
  fabricWeight?: string; // "light" | "medium" | "heavy" | "very heavy"
  sleeveStyle?: string; // "raglan" | "set-in" | "other"
  drawString?: string; // "cotton" | "nylon"
}

interface UndergarmentAttributes extends BaseAttributes {
  type: string; // boxers | briefs | trunks | thong | bikini | other
  waistband: string; // elastic | ribbed  | covered-elastic | drawstring
  breathability?: string; // moisture-wicking | cotton
  supportLevel?: string; // "light" | "medium" | "high"
  legLength: string; // "short" | "medium" | "long"
}

interface GenericAttributes extends BaseAttributes {
  attributes: Record<string, any>;
}

interface ProductVariation {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  image: string[];
  gender: "MALE" | "FEMALE" | "UNISEX";
  ageRange: string;
  tShirtAttributes?: TShirtAttributes;
  pantAttributes?: PantAttributes;
  shoeAttributes?: ShoeAttributes;
  shirtAttributes?: ShirtAttributes;
  jacketAttributes?: JacketAttributes;
  hoodieAttributes?: HoodieAttributes;
  undergarmentAttributes?: UndergarmentAttributes;
  genericAttributes?: GenericAttributes;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  material: string;
  productVariations: ProductVariation[];
  categoryId: string;
}

function getAttributeTitle(attributeKey: string): string {
  return attributeKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Id$/, "ID");
}

// @ts-ignore
function renderAttributes(attributes: ProductAttributes | undefined) {
  if (!attributes) return null;

  //   @ts-ignore
  const renderField = (key: string, value: any) => {
    if (key === "id" || key === "productVariationId") return null;

    const title = getAttributeTitle(key);

    if (typeof value === "boolean") {
      return (
        <div key={key} className="grid grid-cols-2 gap-2">
          <span className="font-medium">{title}:</span>
          <span>{value ? "Yes" : "No"}</span>
        </div>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div key={key} className="grid grid-cols-2 gap-2">
          <span className="font-medium">{title}:</span>
          <span>{value.join(", ")}</span>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      // @ts-ignore
      return Object.entries(value).map(([subKey, subValue]) =>
        renderField(`${key} - ${subKey}`, subValue)
      );
    }
    return (
      <div key={key} className="grid grid-cols-2 gap-2">
        <span className="font-medium">{title}:</span>
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className="text-sm space-y-2 border rounded-lg p-4 h-full">
      <h3 className="font-medium text-base mb-3">Product Details</h3>
      <div className="space-y-2">
        {Object.entries(attributes).map(([key, value]) =>
          renderField(key, value)
        )}
      </div>
    </div>
  );
}

export default function ProductPage({ product }: { product: Product }) {
  // Initialize state with undefined and set actual values after checking product
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Set initial values once product is available
  useEffect(() => {
    if (product?.productVariations?.length > 0) {
      setSelectedColor(product.productVariations[0].color);
      setSelectedSize(product.productVariations[0].size);
    }
  }, [product]);

  // If product is not loaded yet, show loading state
  if (
    !product ||
    !product.productVariations ||
    product.productVariations.length === 0
  ) {
    return <div className="p-4">Loading product details...</div>;
  }

  // Get available variations based on current selection
  const availableVariations = product.productVariations.filter(
    (v) => v.color === selectedColor
  );

  const availableSizes = Array.from(
    new Set(availableVariations.map((v) => v.size))
  );

  // Get the currently selected variation
  const selectedVariation =
    product.productVariations.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) || product.productVariations[0];

  const images = selectedVariation?.image || [product.image];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Reset size if not available in new color
    const sizesForColor = product.productVariations
      .filter((v) => v.color === color)
      .map((v) => v.size);
    if (!sizesForColor.includes(selectedSize as string)) {
      setSelectedSize(sizesForColor[0]);
    }
    setCurrentImageIndex(0);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(parseInt(value));
  };

  const handleAddToCart = () => {
    if (!selectedVariation) return;

    console.log("Adding to cart:", {
      productId: product.id,
      variationId: selectedVariation.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: selectedVariation.price * quantity,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariation) return;

    console.log("Buying now:", {
      productId: product.id,
      variationId: selectedVariation.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: selectedVariation.price * quantity,
    });
  };

  const attributes =
    selectedVariation.tShirtAttributes ||
    selectedVariation.pantAttributes ||
    selectedVariation.shoeAttributes ||
    selectedVariation.shirtAttributes ||
    selectedVariation.jacketAttributes ||
    selectedVariation.hoodieAttributes ||
    selectedVariation.undergarmentAttributes ||
    selectedVariation.genericAttributes;

  console.log(product?.productVariations[0].image);

  const goBack = useBack();
  const fallback = "/";

  // Rest of the component remains the same...
  return (
    <>
      <DesktopNavbar />

      <button onClick={() => goBack(fallback)} className="flex underline">
        <ChevronLeft strokeWidth={2} size={24} className="text-primary" />
        <span className="sr-only">Back</span>
        Go back
      </button>

      <div className="max-w-2xl mx-auto p-4 md:max-w-6xl">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6">
          {/* Product Image Carousel */}
          <div className="relative aspect-square mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {/* <ProductImageGallery
        images={product?.productVariations[0].image}
        productName={product.name}
      /> */}

          <div>
            {/* Product Info */}
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {product.description}
              </p>
              <Badge variant="secondary" className="text-xs md:text-sm">
                {product.brand}
              </Badge>
            </div>

            {selectedVariation && (
              <div className="flex items-baseline gap-2 mt-2 py-2">
                <span className="text-3xl md:text-4xl font-bold">
                  रु. {(selectedVariation.price * quantity).toFixed(2)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs md:text-sm text-muted-foreground">
                    (रु{selectedVariation.price.toFixed(2)} each)
                  </span>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color:</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(product.productVariations.map((v) => v.color))
                  ).map((color) => (
                    <div
                      className="flex flex-col items-center gap-1"
                      key={color}
                    >
                      <button
                        onClick={() => handleColorChange(color)}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-200 relative ${
                          selectedColor === color
                            ? ""
                            : "border-input hover:border-primary"
                        } focus-visible:outline-none`}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && (
                          <Check
                            className="absolute inset-0 m-auto text-primary-foreground mix-blend-difference"
                            size={16}
                            strokeWidth={2}
                          />
                        )}
                      </button>
                      <span className="text-xs md:text-sm">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Size:</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs md:text-sm px-3 py-1"
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-3">
                {selectedVariation && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity:
                    </label>
                    <Select
                      value={quantity.toString()}
                      onValueChange={handleQuantityChange}
                    >
                      <SelectTrigger className="w-14 rounded-full md:w-20 h-8 text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: Math.min(5, selectedVariation.stock) },
                          (_, i) => (
                            <SelectItem
                              key={i + 1}
                              value={(i + 1).toString()}
                              className="text-xs md:text-sm"
                            >
                              {i + 1}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedVariation && (
                  <div className="text-xs md:text-sm">
                    {selectedVariation.stock > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 px-2 py-1"
                      >
                        In Stock ({selectedVariation.stock} available)
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="px-2 py-1">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 py-2 max-w-3xl mx-auto">
                <Button
                  className="flex-1 rounded-full text-sm md:text-base h-10 md:h-12"
                  variant="outline"
                  disabled={!selectedVariation || selectedVariation.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 rounded-full text-sm md:text-base h-10 md:h-12"
                  disabled={!selectedVariation || selectedVariation.stock === 0}
                  onClick={handleBuyNow}
                >
                  <CreditCard className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Basic Info */}
          {selectedVariation && (
            <div className="text-sm space-y-2 border rounded-lg p-4 h-full">
              <h3 className="font-medium text-base mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Age Range:</span>
                <span>{selectedVariation.ageRange}</span>
                <span className="font-medium">Gender:</span>
                <span>{selectedVariation.gender}</span>
                <span className="font-medium">Material:</span>
                <span>{product.material}</span>
              </div>
            </div>
          )}

          {/* Product Attributes */}
          {renderAttributes(attributes)}
        </div>
      </div>
      <MobileNavbar />
    </>
  );
}
