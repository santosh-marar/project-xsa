"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ShoppingCart,
  ArrowUpDown,
  Tag,
  X,
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import MobileNavbar from "@/components/custom/mobile-navbar";
import { ProductCard } from "@/components/custom/product/product-card";
import { Footer } from "@/components/custom/footer";
import { useSession } from "next-auth/react";
import AvatarDropdown from "@/components/custom/avatar-dropdown";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOrder, setSortOrder] = useState<
    "low-to-high" | "high-to-low" | null
  >(null);

  const session = useSession();
  // console.log("session", session);
  const user = session?.data?.user;
  // console.log("user", user);

  const debouncedSearchTerm=useDebounce(searchTerm, 500);

  // console.log("debouncedSearchTerm", debouncedSearchTerm);


  const { data, isLoading } = api.product.getAllProducts.useQuery({
    page: 1,
    pageSize: 10,
    sortBy: sortOrder ? "price" : "createdAt",
    sortOrder: sortOrder === "low-to-high" ? "asc" : "desc",
    search: debouncedSearchTerm,
    filters: {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sizes: selectedSize ? [selectedSize] : [],
      categories: selectedCategory ? [selectedCategory] : [],
      colors: selectedColor ? [selectedColor] : [],
      // genders: selectedGender ? [selectedGender] : [],
      // ageRanges: selectedAgeRange ? [selectedAgeRange] : [],
      brands: selectedBrand ? [selectedBrand] : [],
      materials: selectedMaterial ? [selectedMaterial] : [],
    },
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedGender(null);
    setSelectedAgeRange(null);
    setSelectedBrand(null);
    setSelectedMaterial(null);
    setPriceRange([
      data?.filters.priceRange.min || 0,
      data?.filters.priceRange.max || 50000,
    ]);
    setSortOrder(null);
  };

 const handleCategoryChange = (value: string | null) => {
   setSelectedCategory(value === "all" ? null : value);
 };

  const handlePriceChange = (value: "low-to-high" | "high-to-low" | null) => {
    setSortOrder(value);
  };

  const handleSizeChange = (value: string | null) => {
    setSelectedSize(value === "all" ? null : value);
  };

  const renderFilterSection = (
    title: string,
    items: string[],
    selectedValue: string | null,
    onChange: (value: string | null) => void
  ) => (
    <div>
      <h3 className="font-medium mb-3 text-sm">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`${title.toLowerCase()}-${item}`}
              checked={selectedValue === item}
              onCheckedChange={(checked) => {
                onChange(checked ? item : null);
              }}
            />
            <label
              htmlFor={`${title.toLowerCase()}-${item}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b py-1 transition-all duration-300 bg-white">
          <div className="container mx-auto px-4">
            {/* Top Navigation */}
            <div className="flex h-16 items-center justify-between">
              {/* Logo: show only on desktop */}

              <Link href="/" className="hidden md:block font-bold text-2xl">
                LOGO
              </Link>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-2xl mx-auto">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="w-full rounded-full border pl-10 pr-4 py-5 text-sm 
                  focus-visible:ring-primary focus-visible:ring-offset-0"
                    placeholder="Search for product"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:flex items-center space-x-4 hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="relative rounded-full h-12 w-12"
                >
                  <Link href="/user/cart">
                    <ShoppingCart strokeWidth={2} className="h-8 w-8" />
                    {/* <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                  2
                </span> */}
                  </Link>
                </Button>
                {user ? (
                  <AvatarDropdown user={user} />
                ) : (
                  <Button className="rounded-full font-medium">
                    {/* href={session ? "/api/auth/signout" : "/api/auth/signin"} */}
                    <Link href="/api/auth/signin">Login</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
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

              {/* @ts-ignore */}
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

              {/* Size Filter */}
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
        </header>

        <div className="container mx-auto flex gap-6 p-4 md:p-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="rounded-full"
                >
                  Clear all
                </Button>
              </div>

              {selectedCategory ||
              selectedSize ||
              selectedColor ||
              selectedBrand ||
              priceRange[0] !== (data?.filters.priceRange.min || 0) ||
              priceRange[1] !== (data?.filters.priceRange.max || 50000) ? (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {selectedCategory}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => setSelectedCategory(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {selectedSize && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Size: {selectedSize}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => setSelectedSize(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {selectedColor && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Color: {selectedColor}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => setSelectedColor(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {selectedBrand && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Brand: {selectedBrand}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() => setSelectedBrand(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {(priceRange[0] !== (data?.filters.priceRange.min || 0) ||
                      priceRange[1] !==
                        (data?.filters.priceRange.max || 500000)) && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Price: रु. {priceRange[0]} - रु. {priceRange[1]}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          onClick={() =>
                            setPriceRange([
                              data?.filters.priceRange.min || 0,
                              data?.filters.priceRange.max || 500000,
                            ])
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="space-y-6">
                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm">Price Range</h3>
                    <div className="text-sm text-muted-foreground">
                      रु. {priceRange[0]} - रु. {priceRange[1]}
                    </div>
                  </div>
                  <div className="px-2">
                    <Slider
                      defaultValue={[
                        data?.filters.priceRange.min || 0,
                        data?.filters.priceRange.max || 50000,
                      ]}
                      min={data?.filters.priceRange.min || 0}
                      max={data?.filters.priceRange.max || 50000}
                      step={100}
                      value={priceRange}
                      onValueChange={(values) =>
                        setPriceRange([values[0], values[1]])
                      }
                      className="mb-6"
                    />
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                {renderFilterSection(
                  "Categories",
                  data?.filters.categories.map((c) => c.name) || [],
                  selectedCategory,
                  setSelectedCategory
                )}

                <Separator />

                {/* Sizes */}
                {renderFilterSection(
                  "Sizes",
                  data?.filters.sizes || [],
                  selectedSize,
                  setSelectedSize
                )}

                <Separator />

                {/* Colors */}
                {renderFilterSection(
                  "Colors",
                  data?.filters.colors || [],
                  selectedColor,
                  setSelectedColor
                )}

                <Separator />

                {/* Brands */}
                {renderFilterSection(
                  "Brands",
                  data?.filters.brands || [],
                  selectedBrand,
                  setSelectedBrand
                )}

                {/* Materials */}
                {data?.filters.materials &&
                  data.filters.materials.length > 0 && (
                    <>
                      <Separator />
                      {renderFilterSection(
                        "Materials",
                        data.filters.materials,
                        selectedMaterial,
                        setSelectedMaterial
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="aspect-square bg-gray-200 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                          <div className="flex gap-1">
                            {Array(3)
                              .fill(0)
                              .map((_, j) => (
                                <div
                                  key={j}
                                  className="h-6 w-8 bg-gray-200 rounded animate-pulse"
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                {data?.products && data.products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-2 md:mx-4 lg:mx-8 my-4 md:my-4 lg:my-8">
                    {data?.products.map((product) => (
                      <div
                        key={product.id}
                        className="max-w-[248px] mx-auto w-full"
                      >
                        <ProductCard {...product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your filters or search term
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-full"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <MobileNavbar />
      </div>
      <Footer />
    </div>
  );
}
