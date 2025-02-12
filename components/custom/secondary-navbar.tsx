"use client";

import React from "react";
import useBack from "../../hooks/use-back";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils"; // shadcn/ui helper for merging class names

interface SecondaryNavbarProps {
  fallback?: string; // Optional fallback route
  className?: string; // Allow passing custom styles
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
  fallback = "/",
  className,
}) => {
  const goBack = useBack();

  return (
    <nav
      className={cn(
        "xl:px-8 md:px-4 px-2 min-h-8 py-2 w-8 z-40 max-w-5xl",
        className
      )}
    >
      <Button
        onClick={() => goBack(fallback)}
        variant="outline"
        className="rounded-full"
      >
        <ChevronLeft strokeWidth={2} size={32} className="text-primary" />
        <span className="sr-only">Back</span>
        Go back
      </Button>
    </nav>
  );
};

export default SecondaryNavbar;
