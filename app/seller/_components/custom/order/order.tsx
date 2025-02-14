"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { columns } from "./columns";
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
import { Badge } from "@/components/ui/badge";
import { Search, SortAsc, SortDesc, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";

export default function OrderManagementComponent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"price" | "createdAt" | "orderId">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    string | undefined
  >(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data, isLoading } = api.order.getSellerOrders.useQuery({
    page,
    pageSize,
    // @ts-ignore
    sortBy,
    sortOrder,
    search: search || undefined,
    filters: {
      status: statusFilter,
      paymentMethod: paymentMethodFilter,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the query with the current search term
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter(undefined);
    setPaymentMethodFilter(undefined);
    setPriceRange([0, 1000000]);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Seller Order Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Filters</CardTitle>
          <CardDescription>Search and filter your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: "price" | "createdAt" | "orderId") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Total Price</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="orderId">Order ID</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="w-[180px]"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="mr-2 h-4 w-4" />
                ) : (
                  <SortDesc className="mr-2 h-4 w-4" />
                )}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  {/* @ts-ignore */}
                  <SelectItem value={undefined}>All Statuses</SelectItem>
                  {data?.filters.orderStatuses.map((status) => (
                    <SelectItem key={status.status} value={status.status}>
                      {status.status} ({status.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={paymentMethodFilter}
                onValueChange={setPaymentMethodFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {/* @ts-ignore */}
                  <SelectItem value={undefined}>All Methods</SelectItem>
                  {data?.filters.paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    Price Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Price Range</h4>
                    <Slider
                      min={0}
                      max={1000}
                      step={1}
                      value={priceRange}
                      // @ts-ignore
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between">
                      <Label>Min: ${priceRange[0]}</Label>
                      <Label>Max: ${priceRange[1]}</Label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="secondary" onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : data ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="space-x-2">
              {statusFilter && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
              {paymentMethodFilter && (
                <Badge variant="secondary">
                  Payment: {paymentMethodFilter}
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                </Badge>
              )}
            </div>
            <div>Total Orders: {data.metadata.total}</div>
          </div>
          <DataTable
            columns={columns}
            // @ts-ignore
            data={data.orders}
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
