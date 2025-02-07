"use client";

import { useState } from "react";
import { Search, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  productCount: number;
}

interface FilterHeaderProps {
  categories: Category[];
  onSearch: (term: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onPriceChange: (price: string) => void;
}

export function FilterHeader({
  categories,
  onSearch,
  onCategoryChange,
  onPriceChange,
}: FilterHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="sticky top-0 z-50 bg-background pb-4">
      <div className="flex items-center gap-2 p-4">
        <Button variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for product"
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="flex gap-2 px-4 overflow-x-auto pb-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              Category
              <ChevronDown className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Select Category</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name} ({category.productCount})
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Select onValueChange={onPriceChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low-to-high">Low to High</SelectItem>
            <SelectItem value="high-to-low">High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="flex gap-2">
          Size
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
