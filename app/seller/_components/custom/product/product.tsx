"use client";

import { Suspense } from "react";
import { CreateProductForm } from "./form/create-product";
import { api } from "@/trpc/react";
import { ProductsTable } from "./products-table";

export default function ProductManagerComponent() {
  const [shops] = api.shop.getMyShops.useSuspenseQuery();
  const [categories] = api.productCategory.getAll.useSuspenseQuery();

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-6 gap-4 lg:gap-8">
        <div className="col-span-2">
          <CreateProductForm shops={shops} categories={categories} />
        </div>
        <div className="col-span-4">
          <ProductsTable shops={shops} categories={categories} />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ProductsTable /> */}
      </Suspense>
    </div>
  );
}
