"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Package, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

interface AvatarDropdownProps {
  user?: {
    email?: string | null;
    id?: string;
    image?: string | null;
    name?: string | null;
    role?: string[];
  };
}

const AvatarDropdown = ({ user }: AvatarDropdownProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={user?.image || "/placeholder.svg"}
            alt={user?.name || "User"}
          />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push("/user/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/user/setting")}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        {user?.role?.includes("admin") && user?.role?.includes("user") && (
          <DropdownMenuItem onClick={() => router.push("/user/order")}>
            <Package className="mr-2 h-4 w-4" /> Orders
          </DropdownMenuItem>
        )}
        {user?.role?.includes("admin") && (
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </DropdownMenuItem>
        )}
        {user?.role?.includes("seller") && (
          <DropdownMenuItem onClick={() => router.push("/seller")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
          </DropdownMenuItem>
        )}
        <Separator />
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={() => {
            router.push("/api/auth/signout");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
