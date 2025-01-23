"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";

const ShopManagerComponent = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    logo: "",
    shopCategoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all shops
  const { data: shops, refetch } = api.shop.getAll.useQuery();

  // Create or update shop mutation
  const createOrUpdateShop = api.shop.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  // Update shop mutation
  const updateShop = api.shop.update.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  // Delete shop mutation
  const deleteShop = api.shop.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateShop.mutate({ ...formData, id: editingId });
    } else {
      createOrUpdateShop.mutate(formData);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      logo: "",
      shopCategoryId: "",
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Shop Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Form Section */}
            <div className="w-full lg:w-1/3 p-4 bg-gray-100 rounded-md border">
              <h3 className="text-lg font-medium mb-4">
                {editingId ? "Edit Shop" : "Create Shop"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Shop Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Logo URL"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Shop Category ID"
                  value={formData.shopCategoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, shopCategoryId: e.target.value })
                  }
                  required
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetForm} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Table Section */}
            <div className="w-full lg:w-2/3">
              <div className="w-full overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Shop Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shops?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No shops found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shops?.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">
                            {shop.name}
                          </TableCell>
                          <TableCell>{shop.description}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
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
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteShop.mutate({ id: shop.id })}
                              className="ml-2"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopManagerComponent;
