import { api } from "@/trpc/server";
import ProductPage from "@/components/custom/product/product-details";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

  if (!id) {
    return notFound();
  }

  const product = await api.product.getById(id);

  if (!product) {
    return notFound();
  }

  { /* @ts-ignore */ }
  return <ProductPage product={product} />;
}
