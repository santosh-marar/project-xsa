"use client";

import React, { useState, useEffect, useRef } from "react";
import useBack from "../../hooks/use-back";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SecondaryNavbarProps {
  fallback?: string;
  className?: string;
  pageName?: string;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
  fallback = "/",
  className,
  pageName,
}) => {
  const goBack = useBack();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // Scrolling up → Show navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down & scrolled more than 50px → Hide navbar
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        " xl:px-16 md:px-8 px-2 w-full fixed top-0 left-0 right-0 z-40 border h-14 lg:h-16 flex lg:gap-4 items-center justify-start bg-white transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full",
        className
      )}
    >
      <Button
        className="rounded-full font-medium text2xl"
        variant="ghost"
        size="icon"
        onClick={() => goBack(fallback)}
      >
        <ChevronLeft strokeWidth={2} size={32} className="text-primary" />
        <span className="sr-only">Back</span>
      </Button>
      <h2 className="text-xl md:text-2xl font-medium text-primary">
        {pageName}
      </h2>
    </nav>
  );
};

export default SecondaryNavbar;
