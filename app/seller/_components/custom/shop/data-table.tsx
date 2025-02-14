// @ts-nocheck
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { DeleteConfirmationDialog } from "@/components/custom/delete-confirmation-dialog";

const ShopList = ({
  shops,
  shopCategories,
  setFormData,
  setEditingId,
  deleteShop,
}) => {
  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => (
        <Image src={row.original.logo} alt="Logo" width={48} height={48} />
      ),
    },
    {
      accessorKey: "name",
      header: "Shop Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <>
          {row.original.owner.name}
          <br />
          <span className="text-sm text-gray-500">
            {row.original.owner.email}
          </span>
        </>
      ),
    },
    {
      accessorKey: "shopCategoryId",
      header: "Category",
      cell: ({ row }) =>
        shopCategories?.find((c) => c.id === row.original.shopCategoryId)
          ?.name || "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                id: row.original.id,
                name: row.original.name,
                description: row.original.description,
                logo: row.original.logo,
                shopCategoryId: row.original.shopCategoryId,
              });
              setEditingId(row.original.id);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteConfirmationDialog
            onConfirm={() => deleteShop.mutate({ id: row.original.id })}
            itemName="shop"
          />
        </div>
      ),
    },
  ];

  return (
    <Card className="w-full lg:w-2/3">
      <CardHeader>
        <CardTitle>List of Shops</CardTitle>
      </CardHeader>
      <CardContent>
        <Data columns={columns} data={shops || []} />
      </CardContent>
    </Card>
  );
};

export default ShopList;
