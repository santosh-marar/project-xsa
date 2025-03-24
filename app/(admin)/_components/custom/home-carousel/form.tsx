"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  addHomeCarouselSchema,
  updateHomeCarouselSchema,
} from "@/validation/home-carousel";
import { ImageUploader } from "@/components/custom/image-uploader";
import { ImageUploaderRef } from "@/@types/image";
import { useDebounce } from "@/hooks/use-debounce";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { handleError } from "@/lib/zod-error";

// Basic type for a carousel item
interface HomeCarouselItem {
  id?: string;
  title?: string;
  subtitle?: string;
  price?: number;
  image?: string;
  link?: string;
  bgColor?: string;
  bgImage?: string;
  productId?: string;
}

// Props for the form component
interface HomeCarouselFormProps {
  item?: HomeCarouselItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// Type for product structure based on your data
interface Product {
  id: string;
  name: string;
  image: string;
  description?: string;
  productVariations?: Array<{
    id: string;
    price: number;
    color: string;
    size: string;
    stock: number;
  }>;
}

export function HomeCarouselForm({
  item,
  onCancel,
  onSuccess,
}: HomeCarouselFormProps) {
  // Form field states
  const [title, setTitle] = useState<string>(item?.title || "");
  const [subtitle, setSubtitle] = useState<string>(item?.subtitle || "");
  const [price, setPrice] = useState<number>(item?.price || 0);
  const [image, setImage] = useState<string>(item?.image || "");
  const [link, setLink] = useState<string>(item?.link || "");
  const [bgColor, setBgColor] = useState<string>(item?.bgColor || "#ffffff");
  const [bgImage, setBgImage] = useState<string>(item?.bgImage || "");
  const [id, setId] = useState<string>(item?.id || "");

  // Product selection states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    item?.productId || ""
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Image uploader refs
  const imageRef = useRef<ImageUploaderRef>(null);
  const bgImageRef = useRef<ImageUploaderRef>(null);

  const { data } = api.product.getAllProducts.useQuery({
    page: 1,
    pageSize: 10,
    search: debouncedSearchTerm,
  });
  const products: Product[] = Array.isArray(data?.products)
    ? data.products
    : [];

    console.log(products)

  // Determine if we're editing based on the existence of an id
  const isEditing = Boolean(item && item.id);
  // Use the proper schema for validation
  const schema = isEditing ? updateHomeCarouselSchema : addHomeCarouselSchema;

  // If the incoming item changes, update state accordingly
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setSubtitle(item.subtitle || "");
      setPrice(item.price || 0);
      setImage(item.image || "");
      setLink(item.link || "");
      setBgColor(item.bgColor || "#ffffff");
      setBgImage(item.bgImage || "");
      if (item.id) setId(item.id);
      if (item.productId) setSelectedProductId(item.productId);
    }
  }, [item]);

  // When a product is selected from the list, update relevant fields
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId);
      if (product) {
        setSelectedProduct(product);
        const prodPrice =
          product.productVariations && product.productVariations.length > 0
            ? product.productVariations[0].price
            : 0;
        setPrice(prodPrice);
        // Set link to product page (customize as needed)
        setLink(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`);
        // Auto-fill title and subtitle if not already set
        if (!title) setTitle(product.name);
        if (!subtitle && product.description) setSubtitle(product.description);
        if (product.image && imageRef.current) {
          setImage(product.image);
        }
      }
    } else {
      setSelectedProduct(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, products]);

  const createMutation = api.homeCarousel.create.useMutation({
    onSuccess: async () => {
      toast.success("Carousel created successfully");
      await api.useUtils().homeCarousel.getAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      // handleError(error);
    },
  });

  const updateMutation = api.homeCarousel.update.useMutation({
    onSuccess: async () => {
      toast.success("Carousel updated successfully");
      await api.useUtils().homeCarousel.getAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      // handleError(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Collect the form values into an object
    const formValues = {
      ...(isEditing ? { id } : {}),
      title,
      subtitle,
      price,
      image,
      link,
      bgColor,
      bgImage: bgImage || null,
    };

    // Validate using the zod schema
    try {
      schema.parse(formValues);
    } catch (error) {
      handleError(error);
      return;
    }

    // Upload images if necessary
    let imageUrl = image;
    let bgImageUrl = bgImage;
    if (imageRef.current) {
      const uploadedImageUrl = await imageRef.current.triggerUpload();
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl as string;
      }
    }
    if (bgImageRef.current) {
      const uploadedBgImageUrl = await bgImageRef.current.triggerUpload();
      if (uploadedBgImageUrl) {
        bgImageUrl = uploadedBgImageUrl as string;
      }
    }
    if (!imageUrl) {
      toast.error("Please upload or select an image");
      return;
    }

    // Calling the correct mutation
    if (isEditing) {
      updateMutation.mutate({
        id,
        title,
        subtitle,
        price,
        image: imageUrl,
        link,
        bgColor,
        bgImage: bgImageUrl || null,
      });
    } else {
      createMutation.mutate({
        title,
        subtitle,
        price,
        image: imageUrl,
        link,
        bgColor,
        bgImage: bgImageUrl || null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium">Select Product</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              type="button"
            >
              {selectedProductId && products.length > 0
                ? products.find((p) => p.id === selectedProductId)?.name ||
                  "Select product"
                : "Select product"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command className="">
              <CommandInput
                placeholder="Search products..."
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup className="overflow-y-auto">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={(currentValue) => {
                          setSelectedProductId(
                            currentValue === selectedProductId
                              ? ""
                              : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProductId === product.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <span>{product.name}</span>
                          {product.productVariations &&
                            product.productVariations.length > 0 && (
                              <span className="ml-2 text-sm text-gray-500">
                                रु.{" "}
                                {product.productVariations[0].price.toFixed(2)}
                              </span>
                            )}
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>Loading products...</CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedProduct && (
          <div className="mt-2 rounded bg-blue-50 p-2">
            <div className="flex items-center">
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="mr-2 h-10 w-10 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedProduct.name}</p>
                {selectedProduct.productVariations &&
                  selectedProduct.productVariations.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Price: रु.{" "}
                      {selectedProduct.productVariations[0].price.toFixed(2)}
                    </p>
                  )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-red-500"
                onClick={() => {
                  setSelectedProductId("");
                  setSelectedProduct(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <Input
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block font-medium">Subtitle</label>
        <Input
          placeholder="Enter subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium">
          Price (auto-filled from product)
        </label>
        <Input
          type="number"
          placeholder="Enter price"
          value={price.toString()}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* Link */}
      <div>
        <label className="block font-medium">
          Link (auto-filled for products)
        </label>
        <Input
          placeholder="Enter link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block font-medium">Background Color</label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="#ffffff"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <Input
            type="color"
            className="h-10 w-12 cursor-pointer p-1"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
      </div>

      {/* Image Uploader */}
      <div>
        <label className="block font-medium">Product Image</label>
        {/* Hidden input to store image url */}
        <Input type="hidden" value={image} readOnly />
        <ImageUploader
          ref={imageRef}
          value={image}
          onChange={(url) => setImage(url as string)}
          multiple={false}
          config={{
            maxFiles: 1,
            maxSizeInMB: 50,
            folder: "home-carousel-images",
          }}
        />
      </div>

      {/* Background Image Uploader */}
      <div>
        <label className="block font-medium">Background Image (optional)</label>
        <Input type="hidden" value={bgImage} readOnly />
        <ImageUploader
          ref={bgImageRef}
          value={bgImage}
          onChange={(url) => setBgImage(url as string)}
          multiple={false}
          config={{
            maxFiles: 1,
            maxSizeInMB: 50,
            folder: "home-carousel-background-images",
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
