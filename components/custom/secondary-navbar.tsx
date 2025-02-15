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
        "xl:px-8 md:px-4 px-2 py-3 w-full fixed top-0 left-0 right-0 z-40 shadow-md h-16 bg-secondary",
        className
      )}
    >
      <Button
        className="flex-1 rounded-full text-sm md:text-base"
        variant="outline"
        size="icon"
        onClick={() => goBack(fallback)}
      >
        <ChevronLeft strokeWidth={2} size={32} className="text-primary" />
        <span className="sr-only">Back</span>
      </Button>
    </nav>
  );
};

export default SecondaryNavbar;
