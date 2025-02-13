"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Package,
  Settings,
  User,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentOrders = [
  {
    id: "12345",
    date: "April 15, 2023",
    status: "Delivered",
    total: "$129.99",
    items: 3,
  },
  {
    id: "12346",
    date: "May 1, 2023",
    status: "In Transit",
    total: "$79.99",
    items: 1,
  },
  {
    id: "12347",
    date: "May 10, 2023",
    status: "Processing",
    total: "$199.99",
    items: 2,
  },
];

export default function ProfilePage() {
  const session = useSession();
  // console.log("session",session);

  return (
    <div>
      <SecondaryNavbar />
      <div className="container mx-auto px-4 py-0 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    session?.data?.user?.image ||
                    "/placeholder.svg?height=64&width=64"
                  }
                  alt="User"
                />
                <AvatarFallback>
                  {session?.data?.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-xl font-bold">
                  {session?.data?.user.name}
                </h1>
                <p className="text-gray-500">{session?.data?.user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              asChild
              className="h-10 w-10 rounded-full"
            >
              <Link href="/user/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">रु. {order.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} item(s)
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View order details</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
