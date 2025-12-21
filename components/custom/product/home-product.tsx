"use client";

import { api } from "@/trpc/react";
import { ProductCard } from "./product-card";

const HomeProduct = () => {
  const { data, isLoading, error } = api.product.getAllProducts.useQuery({
    page: 1,
    pageSize: 10
  });

  console.log(data);

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

//   console.log(data);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-2 md:mx-4 lg:mx-8 my-4 md:my-4 lg:my-8">
      {data?.products.map((product) => (
        <div key={product.id} className="max-w-[248px] mx-auto w-full">
          {/* @ts-ignore */}
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
};

export default HomeProduct;
