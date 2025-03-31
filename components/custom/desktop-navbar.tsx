"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import AvatarDropdown from "./avatar-dropdown";

export function DesktopNavbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const session = useSession();
  // console.log("session", session);
  const user = session?.data?.user;
  // console.log("user", user);

  // Update header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 
  // Always sticky and apply blur on scroll
  const headerClasses = `sticky top-0 z-50 w-full border-b py-1 transition-all duration-300 ${
    isScrolled ? "bg-white/80 backdrop-blur-md " : "bg-white"
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo: show only on desktop */}

          <Link href="/" className="hidden md:block font-bold text-2xl">
            LOGO
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full rounded-full border pl-10 pr-4 py-5 text-sm 
                  focus-visible:ring-secondary focus-visible:ring-offset-0"
                placeholder="Search for product"
                onClick={() => router.push("/search")}
              />
            </div>
          </div>
          <div className="md:flex items-center space-x-4 hidden">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative rounded-full h-12 w-12"
            >
              <Link href="/user/cart">
                <ShoppingCart strokeWidth={2} className="h-8 w-8" />
                {/* <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                  2
                </span> */}
              </Link>
            </Button>
            {user ? (
              <AvatarDropdown user={user} />
            ) : (
              <Button className="rounded-full font-medium">
                {/* href={session ? "/api/auth/signout" : "/api/auth/signin"} */}
                <Link href="/api/auth/signin">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
