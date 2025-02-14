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
import { api } from "@/trpc/react";
import { formatNepaliDateInEnglish } from "@/lib/nepali-format-date";

export default function ProfilePage() {
  const session = useSession();

  if (!session.data)
    return (
      <Button className="rounded-full font-medium">
        <Link href="/api/auth/signin">Login</Link>
      </Button>
    );

  const { data: orders } = api.order.getMyOrders.useQuery();

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
              <Link href="/user/setting">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Card className="shadow-none max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Order: {order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNepaliDateInEnglish(order?.date)}
                    </p>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">रु. {order.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.totalItems} item(s)
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Link
                      href={`/user/order/${order.id}`}
                      className="flex items-center"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">View order details</span>
                    </Link>
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
