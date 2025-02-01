"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOut() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="destructive"
      className="rounded-sm w-full"
      size="sm"
    >
      Sign Out
    </Button>
  );
}
