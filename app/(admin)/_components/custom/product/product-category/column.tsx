import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditDialog } from "./edit-dialog";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  parentCategory: ProductCategory | null;
  subCategories: ProductCategory[];
};

export const columns: ColumnDef<ProductCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "parentCategory.name",
    header: "Parent Category",
    cell: ({ row }) => {
      const parentName = row.original.parentCategory?.name;
      return parentName || "None";
    },
  },
  {
    id: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subCategories = row.original.subCategories;
      if (!subCategories || subCategories.length === 0) return "None";

      return (
        <div className="flex flex-wrap gap-1">
          {subCategories.map((subCat) => (
            <Badge key={subCat.id} variant="outline">
              {subCat.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const category = row.original;

      // Cast table.options.meta to the proper type
      const meta = table.options.meta as
        | {
            updateCategory: (
              id: string,
              data: {
                name: string;
                description: string;
                parentId: string | null;
              }
            ) => Promise<void>;
            deleteCategory: (id: string) => Promise<void>;
          }
        | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="flex flex-col gap-1">
            <DropdownMenuLabel className="text-sm text-center">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              Copy category ID
            </DropdownMenuItem>
            <EditDialog
              category={category}
              updateCategory={meta!.updateCategory}
            />
            <DeleteConfirmationDialog
              itemName={category.name}
              onConfirm={() => meta?.deleteCategory(category.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
