import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {

  const content = (
    <>
      {/* <SecondaryNavbar iconHref="/users/setting" text="Shipping Address" /> */}
      <SecondaryNavbar />
      <div className="container mx-auto px-4 py-0 py-20">
        <div className="max-w-4xl mx-auto">
          <Button variant={"ghost"} className="text-destructive" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
              Logout
              <span className="sr-only">Log out</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  return content;
}
