"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { api } from "@/trpc/react";
import { columns } from "./column";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProductCategoryTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const utils = api.useUtils();

  const { data: rawCategories, isLoading } =
    api.productCategory.getAll.useQuery();

  const deleteCategory = api.productCategory.delete.useMutation({
    onSuccess: () => {
      utils.productCategory.getAll.invalidate();
    },
  });

  const updateCategory = api.productCategory.update.useMutation({
    onSuccess: () => {
      utils.productCategory.getAll.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    await deleteCategory.mutateAsync({ id });
  };

  const handleUpdate = async (
    id: string,
    data: { name: string; description: string; parentId: string | null }
  ) => {
    await updateCategory.mutateAsync({ id, ...data });
  };

  if (isLoading) return <div>Loading...</div>;

  // Transform the data to match ProductCategory type
  const categories =
    rawCategories?.map((category) => ({
      ...category,
      parentCategory: category.parentCategory
        ? {
            ...category.parentCategory,
            parentCategory: null,
            subCategories: [],
          }
        : null,
      subCategories: category.subCategories.map((sub) => ({
        ...sub,
        parentCategory: null,
        subCategories: [],
      })),
    })) || [];

  return (
    <Card className="w-full rounded-sm">
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            placeholder="Search categories..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DataTable
            columns={columns}
            data={categories}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            deleteCategory={handleDelete}
            updateCategory={handleUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
