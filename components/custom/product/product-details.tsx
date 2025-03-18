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
import { ProductImageGallery } from "../product-image-gallery";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { DesktopNavbar } from "../desktop-navbar";
import MobileNavbar from "../mobile-navbar";
import useBack from "@/hooks/use-back";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { renderAttributes } from "./render-attribute";
import { ProductVariation } from "@/@types/product";
import { api } from "@/trpc/react";
import SecondaryNavbar from "../secondary-navbar";
import { useRouter } from "next/navigation";

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

export default function ProductPage({ product }: { product: Product }) {
  // Initialize state with undefined and set actual values after checking product
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const session = useSession();
  const router = useRouter();

  const addCart = api.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Product added to cart successfully");
    },
  });

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

    if (!session.data) {
      toast.error("Please sign in to add to cart");
      return;
    }

    addCart.mutate({
      productId: product.id,
      productVariationId: selectedVariation.id,
      quantity,
      price: selectedVariation.price * quantity,
    });

    // router.push("/user/cart");
  };

  // const handleBuyNow = () => {
  //   if (!selectedVariation) return;

  //   console.log("Buying now:", {
  //     productId: product.id,
  //     variationId: selectedVariation.id,
  //     color: selectedColor,
  //     size: selectedSize,
  //     quantity,
  //     price: selectedVariation.price * quantity,
  //   });
  // };

  const attributes =
    selectedVariation.tShirtAttributes ||
    selectedVariation.pantAttributes ||
    selectedVariation.shoeAttributes ||
    selectedVariation.shirtAttributes ||
    selectedVariation.jacketAttributes ||
    selectedVariation.hoodieAttributes ||
    selectedVariation.undergarmentAttributes ||
    selectedVariation.genericAttributes;

  // console.log(product?.productVariations[0].image);
  return (
    <>
      <SecondaryNavbar pageName="Product Details"/>

      <div className="max-w-2xl mx-auto p-4  md:max-w-6xl py-20">
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
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all duration-200 relative ${
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
                      disabled={selectedVariation.stock === 0}
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
                      <Badge variant="secondary" className="bg-red-100 text-red-800 px-2 py-1">
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
                  // variant=""
                  disabled={!selectedVariation || selectedVariation.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                  Add to Cart
                </Button>
                {/* <Button
                  className="flex-1 rounded-full text-sm md:text-base h-10 md:h-12"
                  disabled={!selectedVariation || selectedVariation.stock === 0}
                  onClick={handleBuyNow}
                >
                  <CreditCard className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                  Buy Now
                </Button> */}
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
