"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploaderRef } from "@/@types/image";
import { ImageUploader } from "@/components/custom/image-uploader";
import { useImageDelete } from "@/hooks/use-image";
import { ShopsDataTable } from "./data-table";

const ShopManagerComponent = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    logo: "",
    shopCategoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logo, setLogo] = useState("");
  const logoRef = useRef<ImageUploaderRef>(null);
  const { deleteSingleImage } = useImageDelete();

  // Fetch all shops
  const {
    data: shops,
    refetch,
    isLoading,
    isError,
  } = api.shop.getAll.useQuery();

  const { data: shopCategories } =
    api.shopCategory.getAllShopCategory.useQuery();

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

  // Delete shop mutation with their logo using the useImageDelete hook
  const deleteShop = api.shop.delete.useMutation({
    onSuccess: (_, variables) => {
      const shopToDelete = shops?.find((shop) => shop.id === variables.id);

      if (shopToDelete?.logo) {
        deleteSingleImage(shopToDelete.logo);
      }

      refetch();
    },
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedUrl = await logoRef.current?.triggerUpload();

    if (editingId) {
      updateShop.mutate({ ...formData, id: editingId });
    } else {
      createOrUpdateShop.mutate({ ...formData, logo: uploadedUrl as string });
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
    <div className="p-6 ">
      <div className="flex lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Form Section */}
        <Card className="w-full lg:w-1/3 rounded-sm">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Shop" : "Create Shop"}</CardTitle>
          </CardHeader>
          <CardContent>
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

              <Select
                value={formData.shopCategoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, shopCategoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {shopCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <p>Logo</p>
                <ImageUploader
                  ref={logoRef}
                  value={logo}
                  multiple={false}
                  config={{
                    maxFiles: 1,
                    maxSizeInMB: 50,
                    folder: "shop-logos",
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm} type="button">
                  Cancel
                </Button>
                <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Table section */}
        <div className="rounded-sm border bg-card text-card-foreground shadow w-full px-2 py-4">
          <ShopsDataTable
            shopsData={{
              shops: shops,
              isLoading: isLoading,
              isError: isError,
            }}
            shopCategories={shopCategories}
            setFormData={setFormData}
            setEditingId={setEditingId}
            deleteShop={deleteShop}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopManagerComponent;
