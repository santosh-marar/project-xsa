"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { HomeCarouselForm } from "./form";
import { HomeCarouselTable } from "./table";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { HomeCarouselDialog } from "./dialog";

export type HomeCarouselItem = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  link: string;
  bgColor: string;
  bgImage: string | undefined;
};

export default function HomeCarouselPage() {
  const [selectedItem, setSelectedItem] = useState<HomeCarouselItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState<HomeCarouselItem | null>(null);

  // Fetch all carousel items
  const {
    data: carouselItems,
    isLoading,
    refetch,
  } = api.homeCarousel.getAll.useQuery();

  const handleEdit = (item: HomeCarouselItem) => {
    setSelectedItem(item);
  };

  const handleView = (item: HomeCarouselItem) => {
    setDialogItem(item);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setSelectedItem(null);
    refetch();
    toast.success(
      selectedItem ? "Carousel item updated" : "Carousel item created"
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Home Carousel Management</h1>
        {/* <Button
        // @ts-ignore
          onClick={() => setSelectedItem({})}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Carousel Item
        </Button> */}
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Form */}
        <div>
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">
              {selectedItem?.id ? "Edit Carousel Item" : "Add Carousel Item"}
            </h2>
            <HomeCarouselForm
              item={selectedItem}
              // @ts-ignore
              onCancel={() => setSelectedItem(null)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>

        {/* Right column - Table */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Carousel Items</h2>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <p>Loading carousel items...</p>
              </div>
            ) : (
              <HomeCarouselTable
                // @ts-ignore
                items={carouselItems || []}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={refetch}
              />
            )}
          </div>
        </div>
      </div>

      {isDialogOpen && dialogItem && (
        <HomeCarouselDialog
          item={dialogItem}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
