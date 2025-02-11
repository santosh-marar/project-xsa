"use client";

import { api } from "@/trpc/react";
import ProductPage from "@/components/custom/product-details";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const productId = params.id as string;

  const product = api.product.getById.useQuery(productId, {
    enabled: Boolean(productId),
  });

  console.log(product.data);

  //@ts-ignore
  return <ProductPage product={product?.data} />;
}
