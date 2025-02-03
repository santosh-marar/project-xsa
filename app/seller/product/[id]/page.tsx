"use client";
import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { UpdateProductForm } from "../../_components/custom/product/form/update-product";

export default function ProductPage() {
  const params = useParams(); 
  const productId = params.id as string; 

  const {
    data: product,
    isLoading,
    error,
  } = api.product.getById.useQuery(productId);
  const { data: shops } = api.shop.getAll.useQuery();
  // const { data: categories } = api.productCategory.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return notFound();

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <UpdateProductForm
          // @ts-ignore
          initialData={product}
          shops={shops || []}
          // categories={categories || []}
        />
      </Suspense>
    </div>
  );
}
