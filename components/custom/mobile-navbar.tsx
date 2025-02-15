"use client";

import { useState, useEffect, useRef } from "react";
import { CircleUser, Home, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type React from "react"; // Import for React types

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/user/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/user/profile", icon: CircleUser, label: "Profile" },
];

function MobileNavbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Compare with the last scroll position to detect direction:
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down → hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up → show navbar
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;

      // Clear the previous timeout, if any:
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // After 300ms of no scrolling, show the navbar:
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm md:hidden transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
        "z-50" // Ensure it stays on top
      )}
    >
      <nav className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </footer>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
        isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
      )}
    >
      <div className="relative">
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <p className={cn("text-xs mt-1", isActive && "font-medium")}>{label}</p>
    </Link>
  );
}

export default MobileNavbar;
