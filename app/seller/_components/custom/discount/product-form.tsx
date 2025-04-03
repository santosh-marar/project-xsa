"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Discount,
  DiscountType,
  Product,
  ProductVariation,
} from "@prisma/client";
import { api } from "@/trpc/react";
import Image from "next/image";
import { handleError } from "@/lib/zod-error";
import { toast } from "sonner";

type ProductWithVariations = Product & {
  productVariations: ProductVariation[];
};

// Format discount display text
export const formatDiscountValue = (discount: Discount) => {
  switch (discount.discountType) {
    case DiscountType.PERCENTAGE:
      return `${discount.name} (${discount.value}% off)`;
    case DiscountType.FIXED_AMOUNT:
      return `${discount.name} (
रु. ${discount.value} off)`;
    //   case DiscountType.BUY_X_GET_Y:
    //     return `${discount.name} (Buy ${discount.buyX} Get ${discount.getY})`;
    default:
      return discount.name;
  }
};

export default function ProductVariationDiscountForm() {
  // State for selected product, variations, and discount
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithVariations | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );

  // State for UI controls
  const [productOpen, setProductOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [shops] = api.shop.getMyShops.useSuspenseQuery();
  const shopId = shops?.[0]?.id;

  const { data: productsData } = api.product.getMyProducts.useQuery(
    {
      shopId: shopId as string,
      page: 1,
      pageSize: 100,
    },
    {
      enabled: Boolean(shopId),
    }
  );

  const products = productsData?.products as ProductWithVariations[];

  const { data: discountsData } = api.discount.sellerList.useQuery({
    page: 1,
    pageSize: 100,
  });

  const discounts = discountsData?.discounts;

  // Filter products based on search term
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting all variations
  const handleSelectAll = () => {
    if (!selectedProduct) return;

    if (
      selectedVariations.length === selectedProduct.productVariations.length
    ) {
      setSelectedVariations([]);
    } else {
      setSelectedVariations(selectedProduct.productVariations.map((v) => v.id));
    }
  };

  // Handle variation selection
  const handleVariationToggle = (variationId: string) => {
    setSelectedVariations((prev) =>
      prev.includes(variationId)
        ? prev.filter((id) => id !== variationId)
        : [...prev, variationId]
    );
  };

  const { mutate: createDiscount } =
    api.discount.addVariationDiscounts.useMutation({
      onSuccess: () => {
        toast.success("Product discount created successfully");
      },
      onError: (error: any) => {
        handleError(error);
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedProduct ||
      !selectedDiscount ||
      selectedVariations.length === 0
    ) {
      toast.error(
        "Please select a product, at least one variation, and a discount"
      );
      return;
    }

    setIsSubmitting(true);

    // Correcting the data structure
    const data = {
      discountId: selectedDiscount.id,
      variationIds: selectedVariations, // Array of variation IDs
    };

    // Call the API
    createDiscount(data, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };



  return (
    <Card className="w-full max-w-4xl shadow-none mx-16 my-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          Apply Discount to Product Variations
        </CardTitle>
        <CardDescription>
          Select a product, choose variations, and apply a discount to them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="product">Product</Label>
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={productOpen}
                    className="justify-between"
                  >
                    {selectedProduct
                      ? selectedProduct.name
                      : "Select product..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <Command>
                    <CommandInput
                      placeholder="Search products..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts?.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.id}
                            onSelect={() => {
                              setSelectedProduct(product);
                              setProductOpen(false);
                              setSearchTerm("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProduct?.id === product.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {product.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {!selectedProduct ? (
            <div className="text-sm text-muted-foreground">
              Please select a product first to see available variations.
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading variations...</span>
            </div>
          ) : selectedProduct.productVariations.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No variations found for this product.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedVariations.length ===
                        selectedProduct.productVariations.length &&
                      selectedProduct.productVariations.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Select All</Label>
                </div>
                <Badge variant="outline">
                  {selectedVariations.length} of{" "}
                  {selectedProduct.productVariations.length} selected
                </Badge>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
                  <div className="col-span-1"></div>
                  <div className="col-span-5">Variation</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Stock</div>
                </div>

                <ScrollArea className="h-[300px]">
                  {selectedProduct.productVariations.map((variation) => (
                    <div
                      key={variation.id}
                      className="grid grid-cols-12 gap-2 p-3 items-center border-t hover:bg-muted/20"
                    >
                      <div className="col-span-1">
                        <Checkbox
                          id={`variation-${variation.id}`}
                          checked={selectedVariations.includes(variation.id)}
                          onCheckedChange={() =>
                            handleVariationToggle(variation.id)
                          }
                        />
                      </div>
                      <div className="col-span-5 font-medium">
                        <Image
                          src={variation.image[0]}
                          alt={"image"}
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="col-span-2">
                        रु. {variation.price.toFixed(2)}
                      </div>
                      <div className="col-span-2">{variation.stock}</div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="discount">Discount</Label>
              <Popover open={discountOpen} onOpenChange={setDiscountOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={discountOpen}
                    className="justify-between"
                    disabled={
                      !selectedProduct || selectedVariations.length === 0
                    }
                  >
                    {selectedDiscount
                      ? formatDiscountValue(selectedDiscount)
                      : "Select discount..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <Command>
                    <CommandInput placeholder="Search discounts..." />
                    <CommandList>
                      <CommandEmpty>No discounts found.</CommandEmpty>
                      <CommandGroup>
                        {discounts?.map((discount) => (
                          <CommandItem
                            key={discount.id}
                            value={discount.id}
                            onSelect={() => {
                              setSelectedDiscount(discount);
                              setDiscountOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedDiscount?.id === discount.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {formatDiscountValue(discount)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Submit Button */}
          {/* <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={
              !selectedProduct ||
              selectedVariations.length === 0 ||
              !selectedDiscount ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Discount...
              </>
            ) : success ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Discount Applied!
              </>
            ) : (
              "Apply Discount"
            )}
          </Button> */}

          <Button type="submit" disabled={isSubmitting}>Apply discount on product</Button>
        </form>
      </CardContent>
    </Card>
  );
}
