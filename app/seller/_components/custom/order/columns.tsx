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

export type Order = {
  id: string;
  orderId: string;
  productId: string;
  productVariationId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    name: string;
    image: string;
    shopId: string;
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
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <img
          src={row.original.product.image || "/placeholder.svg"}
          alt={row.original.product.name}
          className="w-8 h-8 rounded-full"
        />
        <span>{row.original.product.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => <div>${row.original.totalPrice.toFixed(2)}</div>,
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.orderId)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
            <DropdownMenuItem>Contact customer</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
