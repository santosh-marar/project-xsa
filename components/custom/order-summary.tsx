import React from "react";
import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// const TAX_PERCENTAGE = 0.1; // 10% tax
const TAX_PERCENTAGE = 0.13;
const SHIPPING_FEE = 0; // Fixed shipping fee

interface OrderSummaryProps {
  calculateTotal: () => number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ calculateTotal }) => {
  const subtotal = calculateTotal();
  const tax = subtotal * TAX_PERCENTAGE;
  const total = subtotal + SHIPPING_FEE; // Default total without tax

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">रु. {subtotal.toFixed(2)}</span>
        </div>

        {/* Uncomment to include tax dynamically */}
        <div className="flex justify-between text-gray-600">
          <span>Tax ({(TAX_PERCENTAGE * 100).toFixed(0)}%)</span>
          <span className="font-medium">रु. {tax.toFixed(2)}</span>
        </div>
       

        <Separator className="my-4" />

        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>रु. {(total + tax).toFixed(2)}</span>{" "}
          {/* Adds tax when uncommented */}
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

export default OrderSummary;
