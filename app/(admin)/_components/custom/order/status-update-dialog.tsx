"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type { PaymentStatus } from "@/@types/payment";
import {
  CheckCircle,
  Clock,
  Package,
  XCircle,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { handleError } from "@/lib/zod-error";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface StatusUpdateDialogProps {
  children: React.ReactNode;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderId: string;
  paymentId: string;
}

export function StatusUpdateDialog({
  children,
  paymentStatus,
  orderStatus,
  orderId,
  paymentId,
}: StatusUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [newOrderStatus, setNewOrderStatus] =
    useState<OrderStatus>(orderStatus);
  const [newPaymentStatus, setNewPaymentStatus] =
    useState<PaymentStatus>(paymentStatus);
  const utils = api.useUtils();

  const { mutate: updateOrderStatus, isPending: isOrderUpdating } =
    api.order.updateOrderByAdminById.useMutation({
      onSuccess: () => {
        toast.success("Order status updated successfully");
        utils.order.getAllOrder.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        handleError(error);
      },
    });

  const { mutate: updatePaymentStatus, isPending: isPaymentUpdating } =
    api.payment.update.useMutation({
      onSuccess: () => {
        toast.success("Payment status updated successfully");
        utils.order.getAllOrder.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        handleError(error);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isOrderStatusChanged = newOrderStatus !== orderStatus;

    const isPaymentStatusChanged = newPaymentStatus !== paymentStatus;

    if (isOrderStatusChanged) {
      updateOrderStatus({ id: orderId, status: newOrderStatus });
    }

    if (isPaymentStatusChanged) {
      updatePaymentStatus({ id: paymentId, status: newPaymentStatus });
    }

    // If neither status has changed, show a message
    if (!isOrderStatusChanged && !isPaymentStatusChanged) {
      toast.info("No changes detected");
    }
  };

  // Helper function to get status color using Tailwind CSS variables
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
      case "PAID":
        return "text-primary"; // Using primary color for success states
      case "PENDING":
      case "PROCESSING":
      case "CONFIRMED":
        return "text-amber-500"; // Using amber for pending/processing states
      case "CANCELLED":
      case "FAILED":
      case "REFUNDED":
        return "text-destructive"; // Using destructive color for error states
      case "SHIPPED":
        return "text-blue-500"; // Using blue for shipped state
      default:
        return "text-muted-foreground";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "PAID":
        return <CreditCard className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "PROCESSING":
      case "CONFIRMED":
        return <RefreshCw className="h-4 w-4" />;
      case "CANCELLED":
      case "FAILED":
        return <XCircle className="h-4 w-4" />;
      case "REFUNDED":
        return <RefreshCw className="h-4 w-4" />;
      case "SHIPPED":
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isPending = isOrderUpdating || isPaymentUpdating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-muted/30 border-b">
          <DialogTitle className="text-xl font-semibold">
            Update Order & Payment Status
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="order-status" className="text-sm font-medium">
                    Order Status
                  </Label>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      getStatusColor(orderStatus)
                    )}
                  >
                    {getStatusIcon(orderStatus)}
                    <span>Current: {orderStatus}</span>
                  </div>
                </div>
                <Select
                  value={newOrderStatus}
                  onValueChange={(value: OrderStatus) =>
                    setNewOrderStatus(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "PENDING",
                      "CONFIRMED",
                      "PROCESSING",
                      "SHIPPED",
                      "DELIVERED",
                      "CANCELLED",
                    ].map((status) => (
                      <SelectItem key={status} value={status}>
                        <span
                          className={cn(
                            "flex items-center gap-2",
                            getStatusColor(status)
                          )}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="payment-status"
                    className="text-sm font-medium"
                  >
                    Payment Status
                  </Label>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      getStatusColor(paymentStatus)
                    )}
                  >
                    {getStatusIcon(paymentStatus)}
                    <span>Current: {paymentStatus}</span>
                  </div>
                </div>
                <Select
                  value={newPaymentStatus}
                  onValueChange={(value: PaymentStatus) =>
                    setNewPaymentStatus(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["PENDING", "PAID", "FAILED", "REFUNDED"] as const).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          <span
                            className={cn(
                              "flex items-center gap-2",
                              getStatusColor(status)
                            )}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4 border-t mt-6">
                <Button
                  type="submit"
                  className="px-6 transition-all hover:scale-105"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
