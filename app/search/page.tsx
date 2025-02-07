"use client";

import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  LayoutGrid,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import MobileNavbar from "@/components/custom/mobile-navbar";
import Link from "next/link";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "low-to-high" | "high-to-low" | null
  >(null);

  const { data, isLoading, error } = api.product.getAll.useQuery({
    page: 1,
    pageSize: 10,
    sortBy: sortOrder ? "price" : "createdAt",
    sortOrder: sortOrder === "low-to-high" ? "asc" : "desc",
    search: searchTerm,
    filters: {
      minPrice: 0,
      maxPrice: 5000,
      sizes: selectedSize ? [selectedSize] : [],
      gender: [],
      ageRange: [],
      categories: selectedCategory ? [selectedCategory] : [],
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size === "all" ? null : size);
  };

  const handlePriceChange = (order: string) => {
    setSortOrder(order === "low-to-high" ? "low-to-high" : "high-to-low");
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error)
    return <div className="text-center py-12">Error: {error.message}</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50">
        <div className="sticky top-0 z-50 bg-white pb-4 shadow-sm">
          <div className="flex items-center gap-3 p-4 pl-0">
            {/* <Button variant="ghost" size="icon" className="shrink-0 -ml-2 w-8 h-8"> */}
              <Link href="/">
              <ChevronLeft size={32}/>
              </Link>
            {/* </Button> */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for product"
                  className="h-12 rounded-full border-[1px] border-input bg-white pl-11 pr-4 text-base"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-4">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger
                className={cn(
                  "h-8 flex-1 min-w-fit rounded-full border-[1px] border-input bg-white px-4",
                  "data-[placeholder]:text-muted-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {data?.filters.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.productCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handlePriceChange}>
              <SelectTrigger
                className={cn(
                  "h-8 flex-1 min-w-fit rounded-full border-[1px] border-input bg-white px-4",
                  "data-[placeholder]:text-muted-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <SelectValue placeholder="Price" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-to-high">Low to High</SelectItem>
                <SelectItem value="high-to-low">High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleSizeChange}>
              <SelectTrigger
                className={cn(
                  "h-8 flex-1 min-w-fit rounded-full border-[1px] border-input bg-white px-4",
                  "data-[placeholder]:text-muted-foreground hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <SelectValue placeholder="Size" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {data?.filters.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data?.products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate text-sm sm:text-base">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {product.brand}
                </p>
                <p className="font-semibold mt-2 text-sm sm:text-base">
                  ${product.productVariations[0]?.price}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Size:{" "}
                  {product.productVariations[0]?.shoeAttributes?.size || "N/A"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {data?.products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
      <MobileNavbar />
    </div>
  );
}
