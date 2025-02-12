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
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ShoppingCart() {
  const utils = api.useUtils();

  const { data: cart, isLoading, error } = api.cart.getCart.useQuery();

  const updateQuantity = api.cart.updateItemQuantity.useMutation({
    onSuccess: () => {
      utils.cart.invalidate();
      toast.success("Quantity updated successfully");
    },
  });

  const removeCardItem = api.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.invalidate();
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

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading your cart...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-destructive">
        Error loading cart: {error.message}
      </div>
    );
  if (!cart || cart.items.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        Your cart is empty.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-20 pt-0">
      <div className="lg:flex lg:gap-12">
        <div className="lg:w-2/3">
          {/* Product List */}
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 items-center gap-6 border rounded-lg pr-2"
              >
                {/* Image: Takes full height & width of its column */}
                <Link
                  href={`/product/रु. {item.product?.id}`}
                  className="relative w-full h-36 block"
                >
                  <Image
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover w-full h-full rounded-l"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex flex-col justify-between h-full py-2">
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
                  <div className="flex items-center justify-between mt-4">
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
                <div className="flex flex-col justify-between items-end h-full py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  {/* Total Price */}
                  <span className="font-bold text-xl text-gray-900">
                    रु. {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3 mt-8 lg:mt-0">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  रु. {calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">
                  रु. {(calculateTotal() * 0.1).toFixed(2)}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>
                  रु.{" "}
                  {(calculateTotal() + 10 + calculateTotal() * 0.1).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <Button className="w-full" asChild>
                <Link
                  href="/user/checkout"
                  className="flex items-center justify-center"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link
                  href="/search"
                  className="flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
