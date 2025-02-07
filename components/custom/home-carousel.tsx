"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "1",
    title: "Top smartwatches",
    subtitle: "Noise, Fire-Boltt, CMF & more",
    price: "From ₹999",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-06%2019-14-44-jBAdqKfdcPTYPpEH64f2XXAXBlOJ9u.png",
  },
  {
    id: "2",
    title: "Premium Phones",
    subtitle: "iPhone, Samsung & more",
    price: "From ₹49,999",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    subtitle: "boAt, OnePlus & more",
    price: "From ₹1,499",
    image: "/placeholder.svg?height=400&width=800",
  },
];

export function HomeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full px-4 py-2 max-w-7xl h-full  mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex ">
          {products.map((product, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <Card className="relative overflow-hidden bg-primary text-white rounded-2xl lg:h-[360px] flex flex-col justify-center">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{product.title}</h2>
                      <p className="text-gray-200">{product.subtitle}</p>
                      <p className="text-xl font-semibold mt-4">
                        {product.price}
                      </p>
                    </div>
                    <div className="relative w-40 h-40">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 160px, 160px"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              selectedIndex === index ? "bg-primary w-6" : "bg-gray-300"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
