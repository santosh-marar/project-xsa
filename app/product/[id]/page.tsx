"use client";

import { api } from "@/trpc/react";
import ProductPage from "@/components/custom/product/product-details";
import { useParams } from "next/navigation";
import SecondaryNavbar from "@/components/custom/secondary-navbar";

export default function Page() {
  const params = useParams();
  const productId = params.id as string;

  const product = api.product.getById.useQuery(productId, {
    enabled: Boolean(productId),
  });

  return (
    <>
      {/* @ts-ignore */}
      <ProductPage product={product?.data} />
    </>
  );
}
