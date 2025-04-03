"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { DiscountScope, DiscountType } from "@prisma/client";
import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";

type Discount = {
  id: string;
  name: string;
  description?: string;
  value: number;
  discountType: DiscountType;
  discountScope: DiscountScope;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate?: string | null;
  minPurchase?: number;
  minItems?: number;
  usageLimit?: number;
  allowStacking: boolean;
  autoApply: boolean;
  ProductVariationDiscounts: Array<{
    variation: {
      id: string;
      name: string;
      product: {
        id: string;
        name: string;
      };
    };
  }>;
};

const columns = (
  onDelete: (discount: Discount) => void,
  handleDeleteDiscount: (id: string) => void
): ColumnDef<Discount>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        {row.original.name}
        {row.original.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "discountType",
    header: "Type",
    cell: ({ row }) =>
      row.original.discountType === DiscountType.PERCENTAGE
        ? "Percentage"
        : row.original.discountType === DiscountType.FIXED_AMOUNT
        ? "Fixed Amount"
        : "Buy X Get Y",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const discount = row.original;
      switch (discount.discountType) {
        case DiscountType.PERCENTAGE:
          return `${discount.value}%`;
        case DiscountType.FIXED_AMOUNT:
          return `$${discount.value.toFixed(2)}`;
        case DiscountType.BUY_X_GET_Y:
          return `Buy X Get ${discount.value}`;
        default:
          return discount.value.toString();
      }
    },
  },
  {
    accessorKey: "discountScope",
    header: "Scope",
    cell: ({ row }) =>
      row.original.discountScope === DiscountScope.CART
        ? "Cart"
        : row.original.discountScope === DiscountScope.PRODUCT
        ? "Product"
        : "Shipping",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.original.isActive
            ? "bg-green-100 text-green-800 hover:bg-green-100/80"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
        )}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      new Date(row.original.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) =>
      row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No end date",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
            onClick={() => {
              // Handle view details
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/seller/discount/${row.original.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(row.original)}
          ></DropdownMenuItem> */}

          <DeleteConfirmationDialog
            itemName={row.original.name}
            onConfirm={() => handleDeleteDiscount(row.original.id)}
          />

        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function DiscountTable() {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    isActive: undefined as boolean | undefined,
    search: undefined as string | undefined,
    discountType: undefined as DiscountType | undefined,
    discountScope: undefined as DiscountScope | undefined,
  });

  const { data: discountList, isLoading } =
    api.discount.sellerList.useQuery(filters);
  const deleteMutation = api.discount.delete.useMutation();
  const utils = api.useUtils();

  const { data } = api.discount.getProductDiscountVariations.useQuery();
  console.log("data",data)

  const handleDeleteDiscount = async (discountId: string) => {
    await deleteMutation.mutateAsync({ id: discountId });
    await utils.discount.sellerList.invalidate();
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }),
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      isActive: undefined,
      search: undefined,
      discountType: undefined,
      discountScope: undefined,
    });
  };

  const hasFilters =
    filters.isActive !== undefined ||
    filters.search !== undefined ||
    filters.discountType !== undefined ||
    filters.discountScope !== undefined;

  return (
    <Card className="max-w-7xl shadow-none mx-16 my-8">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-2xl">Discounts</CardTitle>
          <CardDescription>
            Manage your shop discounts and promotions
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/seller/discount/create-discount">
            <Plus className="mr-2 h-4 w-4" />
            New Discount
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discounts..."
                className="pl-8 w-full sm:w-[300px]"
                value={filters.search || ""}
                onChange={(e) =>
                  handleFilterChange("search", e.target.value || undefined)
                }
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select
                value={filters.discountType || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "discountType",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value={DiscountType.PERCENTAGE}>
                    Percentage
                  </SelectItem>
                  <SelectItem value={DiscountType.FIXED_AMOUNT}>
                    Fixed Amount
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.discountScope || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "discountScope",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All scopes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All scopes</SelectItem>
                  <SelectItem value={DiscountScope.PRODUCT}>Product</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={
                  filters.isActive === undefined
                    ? "all"
                    : filters.isActive.toString()
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    handleFilterChange("isActive", undefined);
                  } else {
                    handleFilterChange("isActive", value === "true");
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button variant="outline" size="icon" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-md">
          <DataTable
            columns={columns((discount) => {
              setSelectedDiscount(discount);
              setShowDeleteDialog(true);
            }, ( handleDeleteDiscount ))}
            /* @ts-ignore */
            data={discountList?.discounts || []}
            isLoading={isLoading}
            pagination={{
              pageIndex: filters.page - 1,
              pageSize: filters.pageSize,
              total: discountList?.metadata.total || 0,
              onPageChange: (page: number) =>
                handleFilterChange("page", page + 1),
            }}
            noDataMessage={
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  No discounts found
                </p>
                {hasFilters && (
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
