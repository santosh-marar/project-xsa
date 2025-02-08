"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  brand: string | null;
  createdAt: Date;
  updatedAt: Date;
  shop: { name: string };
  productCategory: { name: string };
};

interface ProductsTableProps {
  shops: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function ProductsTable({ shops, categories }: ProductsTableProps) {
  const router = useRouter();

  const shopId = shops?.[0]?.id;

  const { data, isError, isLoading, refetch } =
    api.product.getMyProducts.useQuery(
      {
        shopId,
        page: 1,
        pageSize: 10,
      },
      {
        enabled: Boolean(shopId),
      }
    );

  const products = data?.products;

  //   page: 1,
  //   pageSize: 10,
  //   // sortBy: "name",
  //   // sortOrder: "asc",
  //   // search: "shirt",
  //   // filters: {
  //   //   minPrice: 100,
  //   //   maxPrice: 200,
  //   //   sizes: ["M", "L", "XL"],
  //   //   // genders: ["MEN", "WOMEN", "UNISEX"],
  //   //   ageRange: ["INFANT", "KIDS", "TEENS", "ADULTS"],
  //   //   categories: [
  //   //     "T-Shirt",
  //   //     "Pant",
  //   //     "Shoe",
  //   //     "Shirt",
  //   //     "Jacket",
  //   //     "Undergarment",
  //   //   ],
  //   // },
  // });
  // console.log("getAll", da);


  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Error deleting product");
    },
  });

 const handleAddVariation = (productId: string, categoryName: string) => {
   console.log(productId, categoryName);
   router.push(
     `/seller/product/${productId}/variation/create?category=${encodeURIComponent(
       categoryName
     )}`
   );
 };

 const columns: ColumnDef<Product>[] = [
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
     accessorKey: "shop.name",
     header: "Shop",
   },
   {
     accessorKey: "productCategory.name",
     header: "Category",
   },
   {
     accessorKey: "brand",
     header: "Brand",
   },
   {
     accessorKey: "createdAt",
     header: "Created At",
     cell: ({ row }) =>
       new Date(row.getValue("createdAt")).toLocaleDateString(),
   },
   {
     id: "actions",
     header: "Actions",
     cell: ({ row, table }) => {
       const product = row.original;
       return (
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Open menu</span>
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="center" className="flex flex-col gap-1">
             <DropdownMenuLabel className="text-sm text-center">
               Actions
             </DropdownMenuLabel>
             <DropdownMenuItem
               onClick={() => navigator.clipboard.writeText(product.id)}
             >
               Copy category ID
             </DropdownMenuItem>

             <Button
               className="w-full"
               variant="outline"
               size="icon"
               onClick={() =>
                 handleAddVariation(
                   row.original.id,
                   product?.productCategory?.name
                 )
               }
             >
               Add Variation
             </Button>

             <Button
               variant="outline"
               size="icon"
               onClick={() => router.push(`/seller/product/${row.original.id}`)}
             >
               <Pencil className="h-4 w-4" />
             </Button>

             <DeleteConfirmationDialog
               onConfirm={() => deleteProduct.mutate({ id: row.original.id })}
               itemName={`Product "${row.original.name}"`}
             />
           </DropdownMenuContent>
         </DropdownMenu>
       );
     },
   },
 ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return <DataTable columns={columns} data={products || []} />;
}
