import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

interface OrderSummaryProps {
  originalSubtotal: number;
  discount: number;
  discountedSubtotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  originalSubtotal,
  discount,
  discountedSubtotal,
}) => {
  const TAX_PERCENTAGE = 0;
  const SHIPPING_FEE = 0;

  const tax = discountedSubtotal * TAX_PERCENTAGE;
  const total = discountedSubtotal + tax + SHIPPING_FEE;

  return (
    <div className="bg-secondary p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
      <div className="space-y-3">
        {/* Original Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">रु. {originalSubtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span className="font-medium text-green-600">
              -रु. {discount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Discounted Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Discounted Subtotal</span>
          <span className="font-medium">
            रु. {discountedSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Tax */}
        {TAX_PERCENTAGE > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax ({(TAX_PERCENTAGE * 100).toFixed(0)}%)</span>
            <span className="font-medium">रु. {tax.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        {SHIPPING_FEE > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-medium">रु. {SHIPPING_FEE.toFixed(2)}</span>
          </div>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>रु. {total.toFixed(2)}</span>
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
          <Link href="/search" className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary
