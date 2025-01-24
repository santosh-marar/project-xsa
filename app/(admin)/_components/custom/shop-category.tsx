"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { ShopCategory, shopCategorySchema } from "@/validation/shop-category";

export function ShopCategoryCard() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const utils = api.useUtils();

  const { data: shopCategories } =
    api.shopCategory.getAllShopCategory.useQuery();

  const form = useForm<ShopCategory>({
    resolver: zodResolver(shopCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createShopCategory = api.shopCategory.createShopCategory.useMutation({
    onSuccess: async () => {
      await utils.shopCategory.getAllShopCategory.invalidate();
      form.reset();
    },
  });

  const updateShopCategory = api.shopCategory.updateShopCategory.useMutation({
    onSuccess: async () => {
      await utils.shopCategory.getAllShopCategory.invalidate();
      setEditingId(null);
    },
  });

  const deleteShopCategory = api.shopCategory.deleteShopCategory.useMutation({
    onSuccess: async () => {
      await utils.shopCategory.getAllShopCategory.invalidate();
    },
  });

  function onSubmit(values: ShopCategory) {
    if (editingId) {
      updateShopCategory.mutate({ id: editingId, ...values });
    } else {
      createShopCategory.mutate(values);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 lg:space-y-0 lg:flex lg:gap-8">
      <div className="lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Category" : "Create Category"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-slate-100 p-4 rounded-sm">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                createShopCategory.isPending || updateShopCategory.isPending
              }
              className="w-full"
            >
              {editingId
                ? updateShopCategory.isPending
                  ? "Updating..."
                  : "Update Category"
                : createShopCategory.isPending
                ? "Creating..."
                : "Create Category"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Shop Categories</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopCategories && shopCategories.length > 0 ? (
                shopCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(category.id);
                            form.setValue("name", category.name);
                            form.setValue(
                              "description",
                              category.description || ""
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                      
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            deleteShopCategory.mutate({ id: category.id })
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
