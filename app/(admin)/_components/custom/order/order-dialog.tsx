import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type Order } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import React from "react"; // Added import for React
import Link from "next/link";
import Image from "next/image";

interface OrderDialogProps {
  children: React.ReactNode;
  order: Order;
}

export function OrderDialog({ children, order }: OrderDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">Customer Information</h4>
              <p className="text-sm text-muted-foreground">
                Name: {order.user.name || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {order.user.email}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.addressLine1}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.country}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {order.shippingAddress.phoneNumber1}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Payment Information</h4>
              <p className="text-sm text-muted-foreground">
                Method: {order.payment?.method || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {order.payment?.status || "N/A"}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Order Items</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Total Items: {order._count.items}
              </p>
              {order.items.map((item) => (
                <Card key={item.id} className="mb-4 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Link href={`/product/${item.productId}`}>
                        <Image
                          src={
                            item.productVariation.image[0] || item.product.image
                          }
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <h5 className="font-medium">{item.product.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        <p className="text-sm">
                          Color: {item.productVariation.color}, Size:{" "}
                          {item.productVariation.size}
                        </p>
                        <p className="text-sm">
                          Quantity: {item.quantity}, Price: रु.{" "}
                          {item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-medium">
                          Total: रु. {item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          <Separator />
            <div>
              <h4 className="font-medium">Order Information</h4>
              <p className="text-sm text-muted-foreground">
                Order Number: {order.orderNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {order.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Total: रु. {order.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}