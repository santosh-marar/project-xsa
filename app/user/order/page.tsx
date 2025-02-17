"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNepaliDateInEnglish } from "@/lib/nepali-format-date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SearchParamsHandler = ({
  setShowSuccess,
}: {
  setShowSuccess: (value: boolean) => void;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return null;
};

const OrderPage = () => {
  const { data: orders, isLoading } = api.order.getMyOrders.useQuery();
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <SecondaryNavbar pageName="Orders"/>
      <div className="custom-layout">
        <Suspense fallback={null}>
          <SearchParamsHandler setShowSuccess={setShowSuccess} />
        </Suspense>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Package className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              Order Successful!
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Your order has been placed successfully. Thank you for shopping
              with us!
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-none max-w-3xl mx-auto">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800">
              My Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <OrderSkeleton />
            ) : orders && orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">
                          Order: {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatNepaliDateInEnglish(order?.date)}
                        </p>
                        {/* @ts-ignore */}
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          रु. {order.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.totalItems} item
                          {order.totalItems !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10"
                      >
                        <Link
                          href={`/user/order/${order.id}`}
                          className="flex items-center space-x-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                You haven't placed any orders yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const OrderSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, index) => (
      <div key={index}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
        <Separator className="my-4" />
      </div>
    ))}
  </div>
);

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "processing":
      return "secondary";
    case "shipped":
      return "info";
    case "delivered":
      return "info";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

export default OrderPage;
