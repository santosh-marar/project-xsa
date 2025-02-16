"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Order } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import type React from "react";
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
              <h4 className="font-medium">Order Item</h4>
              <Card className="mb-4 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Link href={`/product/${order.product.id}`}>
                      <Image
                        src={
                          order.productVariation.image[0] || order.product.image
                        }
                        alt={order.product.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <h5 className="font-medium">{order.product.name}</h5>
                      <p className="text-sm">
                        Color: {order.productVariation.color}, Size:{" "}
                        {order.productVariation.size}
                      </p>
                      <p className="text-sm">
                        Quantity: {order.quantity}, Price: रु.{" "}
                        {order.productVariation.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Total: रु. {order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
