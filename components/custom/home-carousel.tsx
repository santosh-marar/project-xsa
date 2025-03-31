"use client";
import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/trpc/react";



export function HomeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const { data:carousels, isLoading } = api.homeCarousel.getAll.useQuery();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="relative">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {carousels?.map((carousel, index) => (
              <div className="flex-[0_0_100%] min-w-0" key={index}>
                <Card
                  className={cn(
                    "overflow-hidden rounded-xl",
                    "bg-linear-to-r from-primary/90 to-secondary/50 "
                  )}
                >
                  <div className="p-4 sm:p-6 md:p-8 h-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between h-full">
                      <div className="text-secondary mb-6 md:mb-0 md:max-w-[50%]">
                        <div className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs mb-3">
                          Featured Deal
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold">
                          {carousel.title}
                        </h2>
                        <p className="text-secondary/80 text-sm sm:text-base mt-2">
                          {carousel.subtitle}
                        </p>
                        <p className="text-xl font-semibold mt-4">
                          {carousel.price}
                        </p>
                        <button className="mt-4 px-4 py-2 bg-white text-gray-800 hover:bg-white/90 rounded-full text-sm transition-colors">
                          Shop Now
                        </button>
                      </div>
                      <div className="relative w-full h-40 sm:h-48 md:w-48 md:h-48 lg:w-64 lg:h-64 mx-auto md:mr-0">
                        {/* <div className="absolute inset-0 bg-white/10 rounded-xl -m-3"></div> */}
                        <Image
                          src={carousel.image || "/placeholder.svg"}
                          alt={carousel.title}
                          fill
                          className="object-contain object-center p-2 w-full h-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 192px, 256px"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={scrollPrev}
          className={cn(
            "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition-all z-10",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          disabled={!canScrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={scrollNext}
          className={cn(
            "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition-all z-10",
            !canScrollNext && "opacity-50 cursor-not-allowed"
          )}
          disabled={!canScrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {carousels?.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-6 bg-primary"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
