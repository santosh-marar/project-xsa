"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, CreditCard } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import OrderSummary from "./order-summary";
import { useSession } from "next-auth/react";

export default function ShoppingCart() {
  const utils = api.useUtils();
  const session = useSession();

  const { data: cart, isLoading, error } = api.cart.getCart.useQuery();

  const updateQuantity = api.cart.updateItemQuantity.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
      toast.success("Quantity updated successfully");
    },
  });

  const removeCardItem = api.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
      toast.success("Item removed from cart successfully");
    },
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Quantity Change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity.mutate({
      cartItemId: itemId,
      quantity: newQuantity,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeCardItem.mutate({
      cartItemId: itemId,
    });
  };

  if (!session.data)
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
        {" "}
        {/* Adjust height to prevent full screen stretch */}
        <Button className="rounded-full font-medium">
          <Link href="/api/auth/signin">Login</Link>
        </Button>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
        Loading your cart...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-80px)] text-destructive">
        Error loading cart: {error.message}
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
        Your cart is empty.
      </div>
    );

  console.log(cart);

  cart.items?.map((item, index) => {
    console.log(item);
  });

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item?.totalPrice, 0);
  };

  const calculateTotalDiscount = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) => total + (item?.totalDiscountPrice ?? 0),
      0
    );
  };

  // const originalSubtotal =
  //   cart?.items.reduce((total, item) => {
  //     const price = item.productVariation?.price || 0;
  //     return total + price * item.quantity;
  //   }, 0) || 0;

  //   console.log(originalSubtotal)

  const originalSubtotal = calculateTotal();
  const discount = calculateTotalDiscount();
  const subTotal = originalSubtotal - discount;

  return (
    <div className="custom-layout">
      <div className="lg:flex lg:gap-12">
        <div className="lg:w-2/3">
          {/* Product List */}
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols xs:grid-cols-3 items-center xs:gap-6 gap-2 border rounded-lg "
              >
                {/* Image: Takes full height & width of its column */}
                <Link
                  href={`/product/${item.product?.id}`}
                  className="relative w-full h-36 xs:h-full block"
                >
                  <Image
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover w-full h-full rounded-t xs:rounded-none xs:rounded-l"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex flex-col justify-between h-full p-2">
                  <div className="">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <p>
                        Size:{" "}
                        <span className="font-medium">
                          {item.productVariation?.size || "N/A"}
                        </span>
                      </p>
                      <p>
                        Color:{" "}
                        <span className="font-medium">
                          {item.productVariation?.color || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity Selector & Price */}
                  <div className="flex items-center justify-between sm:mt-4">
                    <div className="flex items-center space-x-2">
                      {isClient && (
                        <Select
                          value={item.quantity.toString()}
                          onValueChange={(value) =>
                            handleQuantityChange(item.id, Number(value))
                          }
                        >
                          <SelectTrigger className="w-14 rounded-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="flex justify-between items-center h-full p-2 xs:flex-col-reverse">
                  {/* Total Price */}
                  <span className="font-bold text-base lg:text-xl text-gray-900">
                    रु. {item.totalPrice.toFixed(2)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          Order Summary
          <OrderSummary
            originalSubtotal={originalSubtotal}
            discount={discount}
            discountedSubtotal={subTotal}
          />{" "}
        </div>
      </div>
    </div>
  );
}
