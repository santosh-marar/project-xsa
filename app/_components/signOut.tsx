"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOut() {
  const handleSignOut = async () => {
    await signOut(); // Triggers sign-out on the client
  };

  return (
    <div className="w-full max-w-xs">
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
