"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Autoplay from "embla-carousel-autoplay";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ProductImage = {
  src: string;
  alt: string;
};

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
    WheelGesturesPlugin(),
  ]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  React.useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = React.useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div
        className="relative overflow-hidden rounded-lg"
        ref={emblaMainRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex aspect-square">
          {images.map((image, index) => (
            <div className="relative flex-[0_0_100%]" key={index}>
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90 transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90 transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative" ref={emblaThumbsRef}>
        <div className="flex gap-2 mx-auto max-w-[90%]">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={cn(
                "relative flex-[0_0_20%] aspect-square overflow-hidden rounded-md transition-all duration-300",
                selectedIndex === index
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              )}
              type="button"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, (max-width: 1200px) 10vw, 5vw"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
