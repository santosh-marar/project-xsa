// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageOff, Edit, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { toast } from "sonner";

const AttributesList = ({ attributes }) => {
  if (!attributes) return null;

  return (
    <div className="mt-2 space-y-1">
      {Object.entries(attributes).map(([key, value]) => {
        if (key === "id" || key === "productVariationId" || !value) return null;
        return (
          <Badge key={key} variant="secondary" className="mr-2">
            {key.replace(/([A-Z])/g, " $1").toLowerCase()}: {value}
          </Badge>
        );
      })}
    </div>
  );
};

const VariationCard = ({ variation, onDelete }) => {
  const attributes = {
    ...variation.shoeAttributes,
    ...variation.shirtAttributes,
    ...variation.pantAttributes,
    ...variation.jacketAttributes,
    ...variation.tShirtAttributes,
    ...variation.hoodieAttributes,
    ...variation.undergarmentAttributes,
    ...variation.genericAttributes,
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm rounded-xl transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center gap-5">
          {/* Product Image */}
          <div className="h-20 w-20 rounded-xl bg-gray-100 flex items-center justify-center shadow-md overflow-hidden">
            {variation.image?.[0] ? (
              <img
                src={variation.image[0]}
                alt="Product"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <ImageOff className="h-6 w-6 text-gray-400" />
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">
                ${variation.price}
              </span>
              <Badge
                variant={variation.stock > 0 ? "default" : "destructive"}
                className="text-sm px-3 py-1.5"
              >
                {variation.stock > 0
                  ? `${variation.stock} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {variation.modelNumber && (
                <Badge variant="outline" className="px-3 py-1">
                  Model: {variation.modelNumber}
                </Badge>
              )}
              {variation.warranty && (
                <Badge variant="outline" className="px-3 py-1">
                  Warranty: {variation.warranty}
                </Badge>
              )}
            </div>

            {/* Attributes */}
            <AttributesList attributes={attributes} />
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-end gap-3 p-4 border-t">
        <DeleteConfirmationDialog
          onConfirm={() => onDelete(variation.id)}
          itemName={`Variation ${variation.modelNumber || variation.id}`}
        />
      </CardFooter>
    </Card>
  );
};

const ProductVariationTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [shops] = api.shop.getMyShops.useSuspenseQuery();

  const shopId = shops?.[0]?.id ?? "";
  // console.log(shopId);

  const { data, isLoading, refetch } = api.product.getMyProducts.useQuery(
    {
      shopId,
      sortBy: sorting[0]?.id as "name" | "createdAt" | undefined,
      sortOrder: sorting[0]?.desc ? "desc" : "asc",
    },
    {
      enabled: Boolean(shopId),
    }
  );

  console.log(data);

  const deleteProductVariation = api.productVariation.delete.useMutation({
    onSuccess: () => {
      toast.success("Product variation deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Error deleting product variation");
    },
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.name,
        header: "Product Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
              {row.original.image ? (
                <img
                  src={row.original.image}
                  className="h-full w-full object-cover rounded-md"
                  alt={row.original.name}
                />
              ) : (
                <ImageOff className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{row.original.name}</span>
              <span className="text-sm text-gray-500">
                {row.original.brand}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "category",
        accessorFn: (row) => row.productCategory.name,
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.productCategory.name}
          </Badge>
        ),
      },
      {
        id: "variations",
        accessorFn: (row) => row.productVariations.length,
        header: "Variations",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {row.original.productVariations.length} variants
            </Badge>
            <Badge
              variant={
                row.original.productVariations.some((v) => v.stock > 0)
                  ? "default"
                  : "destructive"
              }
            >
              {row.original.productVariations.some((v) => v.stock > 0)
                ? "In Stock"
                : "Out of Stock"}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return data.products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all"
          ? true
          : product.productCategory.name === selectedCategory;

      const matchesPriceRange = product.productVariations.some(
        (v) => v.price >= priceRange[0] && v.price <= priceRange[1]
      );

      return matchesCategory && matchesPriceRange;
    });
  }, [data?.products, selectedCategory, priceRange]);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data?.products) return <div>No products found</div>;

  const { min: minPrice, max: maxPrice } = data.filters.priceRange;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Product Variations</CardTitle>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search products..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showFilters && (
        <div className="px-6 py-4 border-b space-y-4">
          <div className="flex gap-4">
            <div className="w-64">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {data.filters.categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-sm">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </div>
              <Slider
                value={priceRange}
                min={minPrice}
                max={maxPrice}
                step={1}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
              />
            </div>
          </div>
        </div>
      )}

      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setExpanded((prev) => ({
                      ...prev,
                      [row.id]: !prev[row.id],
                    }));
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {expanded[row.id] && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="p-4 space-y-4">
                        <h4 className="font-medium">Product Variations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {row.original.productVariations.map((variation) => (
                            <VariationCard
                              key={variation.id}
                              variation={variation}
                              onDelete={(id) =>
                                deleteProductVariation.mutate({ id })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of {data.metadata.total}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductVariationTable;
