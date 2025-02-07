"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { src: "/placeholder.svg?height=400&width=800", alt: "Aviation 1" },
  { src: "/placeholder.svg?height=400&width=800", alt: "Aviation 2" },
  { src: "/placeholder.svg?height=400&width=800", alt: "Aviation 3" },
  { src: "/placeholder.svg?height=400&width=800", alt: "Aviation 4" },
];

export function AviationCarousel() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-0">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[2/1] w-full">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-100 bg-opacity-75">
            <CarouselPrevious variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </CarouselPrevious>
            <span className="text-sm font-medium">
              {current} / {count}
            </span>
            <CarouselNext variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </CarouselNext>
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
}
