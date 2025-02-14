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
import React from "react"; // Added import for React

export function OrderDialog({
  children,
  order,
}: {
  children: React.ReactNode;
  order: Order;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">Order Information</h4>
              <p className="text-sm text-muted-foreground">
                Order Number: {order.orderNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {order.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Total: ${order.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <Separator />
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
              <p className="text-sm text-muted-foreground">
                Total Items: {order._count.items}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
