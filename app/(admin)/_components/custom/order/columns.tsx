"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { OrderDialog } from "./order-dialog";
import { toast } from "sonner";
import { StatusUpdateDialog } from "./status-update-dialog";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "ESEWA" | "KHALTI";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type ShippingAddress = {
  fullName: string;
  phoneNumber1: string;
  city: string;
  street: string;
  addressLine1: string;
  state: string;
  country: string;
};

interface OrderItem {
  id: string;
  orderId: string;
  price: number;
  product: {
    description: string;
    image: string;
    name: string;
  };
  productId: string;
  productVariation: {
    color: string;
    image: string[];
    price: number;
    size: string;
  };
  productVariationId: string;
  quantity: number;
  totalPrice: number;
}

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
  } | null;
  shippingAddress: {
    fullName: string;
    phoneNumber1: string;
    city: string;
    street: string;
    addressLine1: string;
    state: string;
    country: string;
  };
  _count: {
    items: number;
  };
  items: OrderItem[];
};

const handleCopyId = (id: string) => {
  navigator.clipboard.writeText(id);
  toast.success("Order ID copied to clipboard");
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderNumber",
    header: "Order Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getBadgeVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <div>रु. {row.original.total.toFixed(2)}</div>,
  },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.user.name || "N/A"}</div>,
  },
  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.shippingAddress.fullName}</div>
        <div>
          {row.original.shippingAddress.city},{" "}
          {row.original.shippingAddress.state}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "shippingAddress.phoneNumber1",
    header: "Phone",
    cell: ({ row }) => <div>{row.original.shippingAddress.phoneNumber1}</div>,
  },
  {
    accessorKey: "payment.method",
    header: "Payment Method",
    cell: ({ row }) => <div>{row.original.payment?.method || "N/A"}</div>,
  },
  {
    accessorKey: "payment.status",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge
        variant={getBadgeVariant(row.original.payment?.status || "PENDING")}
      >
        {row.original.payment?.status || "PENDING"}
      </Badge>
    ),
  },
  {
    accessorKey: "_count.items",
    header: "Items",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleString()}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleCopyId(order.id)}>
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <OrderDialog order={order}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                View details
              </DropdownMenuItem>
            </OrderDialog>
            <StatusUpdateDialog
              orderStatus={order.status}
              // @ts-ignore
              paymentMethod={order.payment?.method}
              // @ts-ignore
              paymentStatus={order.payment?.status}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Update status
              </DropdownMenuItem>
            </StatusUpdateDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function getBadgeVariant(
  status: OrderStatus | PaymentStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "processing":
    case "confirmed":
      return "default";
    case "completed":
    case "delivered":
      return "outline";
    case "cancelled":
    case "failed":
      return "destructive";
    default:
      return "default";
  }
}
