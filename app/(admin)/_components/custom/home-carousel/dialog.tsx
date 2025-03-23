"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HomeCarouselItem } from "./page";

interface HomeCarouselDialogProps {
  item: HomeCarouselItem;
  open: boolean;
  onClose: () => void;
}

export function HomeCarouselDialog({
  item,
  open,
  onClose,
}: HomeCarouselDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carousel Item Preview</DialogTitle>
        </DialogHeader>

        <div
          className="carousel-preview relative my-4 overflow-hidden rounded-lg"
          style={{
            backgroundColor: item.bgColor,
            backgroundImage: item.bgImage ? `url(${item.bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "300px",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white">
            <h2
              className="text-4xl font-bold"
              style={{ color: "var(--carousel-title-color, white)" }}
            >
              {item.title}
            </h2>
            <p
              className="mb-4 mt-2 text-lg"
              style={{ color: "var(--carousel-subtitle-color, white)" }}
            >
              {item.subtitle}
            </p>
            <p
              className="mb-4 text-3xl font-bold"
              style={{ color: "var(--carousel-price-color, white)" }}
            >
              {item.price.toLocaleString()}
            </p>
            <Button
              className="mt-4"
              style={{ backgroundColor: "var(--carousel-button-bg, black)" }}
            >
              View Details
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p>{item.title}</p>
          </div>
          <div>
            <h3 className="font-semibold">Subtitle</h3>
            <p>{item.subtitle}</p>
          </div>
          <div>
            <h3 className="font-semibold">Price</h3>
            <p>{item.price.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Link</h3>
            <p className="truncate">{item.link}</p>
          </div>
          <div>
            <h3 className="font-semibold">Background Color</h3>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: item.bgColor }}
              ></div>
              <p>{item.bgColor}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Image</h3>
            <p className="truncate">{item.image}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
