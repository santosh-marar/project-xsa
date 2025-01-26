"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { Shop } from "@/@types/shop";




export const columns: ColumnDef<Shop>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => (
      <div className="relative w-10 h-10">
        <Image
          src={row.getValue("logo") || "/placeholder.svg"}
          alt={`${row.getValue("name")} logo`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shop Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.getValue("owner") as { name: string; email: string };
      return (
        <div>
          <div>{owner.name}</div>
          <div className="text-sm text-muted-foreground">{owner.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "shopCategoryId",
    header: "Category",
    cell: ({ row, table }) => {
      const categoryId = row.getValue("shopCategoryId") as string;
      const categories = (table.options.meta as any)?.shopCategories || [];
      const category = categories.find((c: any) => c.id === categoryId);
      return category ? category.name : "N/A";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const shop = row.original;
      const { setFormData, setEditingId, deleteShop } =
        (table.options.meta as any) || {};

      return (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel className="text-sm text-center">Actions</DropdownMenuLabel>
              <Button
                onClick={() => {
                  setFormData({
                    id: shop.id,
                    name: shop.name,
                    description: shop.description,
                    logo: shop.logo,
                    shopCategoryId: shop.shopCategoryId,
                  });
                  setEditingId(shop.id);
                }}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Edit Shop
              </Button>
              <DeleteConfirmationDialog
                onConfirm={() => deleteShop.mutate({ id: shop.id })}
                itemName={`shop "${shop.name}"`}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
