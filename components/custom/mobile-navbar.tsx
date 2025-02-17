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


  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm md:hidden transition-transform duration-300"
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
        isActive ? "text-primary border-primary" : "text-gray-400  hover:text-gray-600"
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
