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
import { type PaymentMethod, type OrderStatus, type PaymentStatus } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import React from "react"; // Added import for React
import Link from "next/link";
import Image from "next/image";

interface StatusUpdateDialogProps {
  children: React.ReactNode;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
}

export function StatusUpdateDialog({ children, paymentMethod, paymentStatus, orderStatus }: StatusUpdateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[70vh] pr-4">
           
            <Separator />
           
            <Separator />
            <div>

            <Separator />
            
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
