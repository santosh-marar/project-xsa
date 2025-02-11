"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { auth } from "@/server/auth";      

// Mock user state - replace with your actual auth logic
const user = null; // Set this to your user object when logged in

export function DesktopNavbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Update header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect screen size changes to set mobile flag
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Always sticky and apply blur on scroll
  const headerClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo: show only on desktop */}
          {!isMobile && (
            <Link href="/" className="text-2xl font-bold italic text-primary">
              logo
            </Link>
          )}

          {/* Search Bar */}
          <div className="flex-1 mx-4 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
              <Input
                className="w-full rounded-full border-2 border-gray-900 pl-10 pr-4 py-5 text-sm 
    focus:outline-none focus:ring-[1px] focus:ring-primary focus:ring-offset-0 
    transition-all duration-300 placeholder:text-gray-600"
                placeholder="Search for product"
                onClick={isMobile ? () => router.push("/search") : undefined}
              />
            </div>
          </div>

          {/* Cart and Login/Avatar: show only on desktop */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                  2
                </span>
              </Button>
              {user ? (
                <Avatar>
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <Button className="rounded-full font-medium">
                  {/* href={session ? "/api/auth/signout" : "/api/auth/signin"} */}
                  <Link href="/api/auth/signin">Login</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
