"use client";

import React from "react";
import useBack from "../../hooks/use-back";
import { ChevronLeft } from "lucide-react";
interface SecondaryNavbarProps {
  fallback?: string; // Optional fallback route
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
  fallback = "/",
}: SecondaryNavbarProps) => {
  const goBack = useBack();

  return (
    <nav className="xl:px-8 md:px-4 px-2 flex min-h-8 py-2 w-8 z-40">
      <button onClick={() => goBack(fallback)}>
        <ChevronLeft strokeWidth={2} size={32} className="text-primary"/>
      </button>
    </nav>
  );
};

export default SecondaryNavbar;
