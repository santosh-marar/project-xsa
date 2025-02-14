"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNepaliDateInEnglish } from "@/lib/nepali-format-date";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { JsonObject } from "@prisma/client/runtime/library";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface ShippingAddress {
  fullName: string;
  phoneNumber1: string;
  phoneNumber2?: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  district: string;
  city?: string;
  village?: string;
  street: string;
  zipCode?: string;
  addressType: "HOME" | "WORK" | "OTHER";
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const getMyOrders = api.order.getMyOrderById.useQuery(orderId, {
    enabled: Boolean(params.id),
  });

  const order = getMyOrders.data;

  console.log("order", order);

  const shippingAddress = order?.shippingAddress as JsonObject | null;

  if (shippingAddress) {
    // Cast to ShippingAddress explicitly
    // @ts-ignore
    const typedShippingAddress = shippingAddress as ShippingAddress;
    return (
      <>
        <SecondaryNavbar />
        <div className="container mx-auto px-4 py-0 pb-20">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-none">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <span>Order Number:</span>
                  <span className="font-semibold">{order?.orderNumber}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Date:</span>
                  <span>{formatNepaliDateInEnglish(order?.createdAt)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Status:</span>
                  <Badge
                    variant={
                      order?.status === "PENDING" ? "secondary" : "outline"
                    }
                  >
                    {order?.status}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-4">
                  {order?.items.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0 cursor-pointer">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="block"
                        >
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md transition-transform hover:scale-105"
                          />
                        </Link>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        रु. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>रु. {order?.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>रु. {order?.shippingCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax:</span>
                  <span>रु. {order?.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-4">
                  <span>Total:</span>
                  <span>रु. {order?.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{typedShippingAddress.fullName}</p>
                  <p>{typedShippingAddress.addressLine1}</p>
                  <p>
                    {typedShippingAddress.city}, {typedShippingAddress.state}
                  </p>
                  <p>{typedShippingAddress.country}</p>
                  <p>Phone: {typedShippingAddress.phoneNumber1}</p>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>Method:</span>
                    <span>{order?.payment?.method}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Status:</span>
                    <Badge
                      variant={
                        order?.payment?.status === "PENDING"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order?.payment?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Amount:</span>
                    <span>रु. {order?.payment?.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }
}
