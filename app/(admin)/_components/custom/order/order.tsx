"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { DataTable } from "./data-table";
import {
  columns,
  type Order,
  type OrderStatus,
  type PaymentMethod,
} from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function OrderManagementComponent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"total" | "createdAt" | "orderNumber">(
    "total"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(
    undefined
  );
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | undefined
  >(undefined);

  const debouncedSearch=useDebounce(search, 300);

  const { data, isLoading } = api.order.getAllOrder.useQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
    search: debouncedSearch || undefined,
    filters: {
      status: statusFilter,
      paymentMethod: paymentMethodFilter,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Search, filter, and manage your orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="text-sm font-medium mb-2 block"
                >
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Order number, customer name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full sm:w-[180px]">
                <label
                  htmlFor="status-filter"
                  className="text-sm font-medium mb-2 block"
                >
                  Order Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as OrderStatus | undefined)
                  }
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined as any}>
                      All Statuses
                    </SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-[180px]">
                <label
                  htmlFor="payment-filter"
                  className="text-sm font-medium mb-2 block"
                >
                  Payment Method
                </label>
                <Select
                  value={paymentMethodFilter}
                  onValueChange={(value) =>
                    setPaymentMethodFilter(value as PaymentMethod | undefined)
                  }
                >
                  <SelectTrigger id="payment-filter">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined as any}>
                      All Methods
                    </SelectItem>
                    <SelectItem value="CASH_ON_DELIVERY">
                      Cash on Delivery
                    </SelectItem>
                    <SelectItem value="ESEWA">eSewa</SelectItem>
                    <SelectItem value="KHALTI">Khalti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-[200px]">
                <label
                  htmlFor="sort-by"
                  className="text-sm font-medium mb-2 block"
                >
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(
                    value: "total" | "createdAt" | "orderNumber"
                  ) => setSortBy(value)}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total Amount</SelectItem>
                    <SelectItem value="createdAt">Created At</SelectItem>
                    <SelectItem value="orderNumber">Order Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Sort Order
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="mr-2 h-4 w-4" />
                  ) : (
                    <SortDesc className="mr-2 h-4 w-4" />
                  )}
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>
              </div>
              <div className="flex-1 flex items-end">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    /* Implement reset filters logic */
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : data ? (
        <>
          <DataTable
            columns={columns}
            // @ts-ignore
            data={data.orders as Order[]}
            pageCount={data.metadata.totalPages}
            onPageChange={setPage}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {data.orders.length} of {data.metadata.total} orders
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <div className="text-center">No orders found</div>
      )}
    </div>
  );
}
