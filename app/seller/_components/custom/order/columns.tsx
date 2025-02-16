"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderDialog } from "./product-dialog";

export type Order = {
  id: string;
  quantity: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    image: string;
    shopId: string;
  };
  productVariation: {
    id: string;
    image: string[];
    size: string;
    color: string;
    price: number;
  };
  order: {
    createdAt: Date;
    status: string;
    payment: {
      method: string;
      status: string;
    };
  };
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
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => <div>रु. {row.original.totalPrice.toFixed(2)}</div>,
  },
  {
    accessorKey: "order.status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.order.status}</Badge>,
  },
  {
    accessorKey: "order.payment.method",
    header: "Payment Method",
  },
  {
    accessorKey: "order.payment.status",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.order.payment.status}</Badge>
    ),
  },
  {
    accessorKey: "order.createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>{new Date(row.original.order.createdAt).toLocaleString()}</div>
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
            <OrderDialog order={order}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                View product details
              </DropdownMenuItem>
            </OrderDialog>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
