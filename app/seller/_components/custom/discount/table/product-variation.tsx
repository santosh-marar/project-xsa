"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {  MoreHorizontal, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { handleError } from "@/lib/zod-error";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import Image from "next/image";
import Link from "next/link"

type DiscountVariation = {
  relationId: string;
  discount: {
    id: string;
    name: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    maxValue: number | null;
    validUntil: Date | null;
  };
  variation: {
    id: string;
    sku: string;
    price: number;
    discountedPrice: number | null;
    stock: number;
    image: string;
    productName: string;
    productId:string;
  };
};

const columns = (
  handleDelete: (discountId: string, variationId: string) => void
): ColumnDef<DiscountVariation>[] => [
  {
    accessorKey: "variation.image",
    header: "Image",
    cell: ({ row }) => (
      <Link href={`/product/${row.original.variation.productId}`}>
        <Image
          src={row.original.variation.image}
          alt="Product"
          width={48}
          height={48}
          className="h-12 w-12 object-cover rounded"
        />
      </Link>
    ),
  },
  {
    accessorKey: "variation.productName",
    header: "Product Name",
  },
  {
    accessorKey: "variation.price",
    header: "Original Price",
    cell: ({ row }) => (
      <span>Rs {row.original.variation.price.toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "discount.value",
    header: "Discount",
    cell: ({ row }) => (
      <span>
        {row.original.discount.type === "PERCENTAGE"
          ? `${row.original.discount.value}%`
          : `Rs ${row.original.discount.value}`}
      </span>
    ),
  },
  {
    accessorKey: "variation.discountedPrice",
    header: "Discounted Price",
    cell: ({ row }) => (
      <span className="text-green-600">
        {row.original.variation.discountedPrice
          ? `Rs ${row.original.variation.discountedPrice.toFixed(2)}`
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "discount.validUntil",
    header: "Valid Until",
    cell: ({ row }) =>
      row.original.discount.validUntil
        ? format(new Date(row.original.discount.validUntil), "MMM dd, yyyy")
        : "No expiration",
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
          <DeleteConfirmationDialog
            itemName={`${row.original.variation.productName} - ${row.original.discount.name}`}
            onConfirm={() =>
              handleDelete(row.original.discount.id, row.original.variation.id)
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function DiscountVariationsTable() {
  const utils = api.useUtils();

  const { mutate } = api.discount.deleteVariationDiscounts.useMutation({
    onSuccess: () => {
      toast.success("Discount removed successfully");
      utils.discount.getProductDiscountVariations.invalidate();
    },
    onError: (error) => handleError(error),
  });

  const handleDelete = (discountId: string, variationId: string) => {
    mutate({
      discountId,
      variationIds: [variationId],
    });
  };

  const { data, isLoading } =
    api.discount.getProductDiscountVariations.useQuery();

    console.log(data)

  return (
    <div className="rounded-md max-w-7xl mx-16 my-8 shadow-none">
      <DataTable
        columns={columns(handleDelete)}
        // @ts-ignore
        data={data || []}
        isLoading={isLoading}
        pagination
        pageSize={20}
      />
    </div>
  );
}