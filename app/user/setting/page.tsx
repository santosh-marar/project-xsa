import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { Button } from "@/components/ui/button";
import { USER_ROLE } from "@/constants";
import { auth } from "@/server/auth";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  // console.log("user", user);

  const content = (
    <>
      <SecondaryNavbar pageName="Settings" />
      <div className="container mx-auto max-w-4xl flex flex-col items-start justify-start px-4 py-20">
        <Button variant={"ghost"} className="text-destructive" asChild>
          <Link href="/api/auth/signout">
            <LogOut className="h-4 w-4" />
            Logout
            <span className="sr-only">Log out</span>
          </Link>
        </Button>
        {user?.role?.includes(USER_ROLE.ADMIN) && (
          <Button variant={"ghost"} className="text-primary" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
              <span className="sr-only">Admin Dashboard</span>
            </Link>
          </Button>
        )}
        {user?.role?.includes(USER_ROLE.SELLER) && (
          <Button variant={"ghost"} className="text-primary" asChild>
            <Link href="/seller">
              <LayoutDashboard className="h-4 w-4" />
              Seller Dashboard
              <span className="sr-only">Seller dashboard</span>
            </Link>
          </Button>
        )}
      </div>
    </>
  );

  return content;
}
