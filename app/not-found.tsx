import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <ShoppingBag className="h-16 w-16 text-primary" />
          <h1 className="mt-4 text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
            404 - Page Not Found
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Oops! It looks like the product you're looking for has gone on
            vacation. Our digital shelves are missing this item.
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="rounded-full">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Homepage
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="rounded-full"
          >
            <Link href="/search" className="inline-flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Can't find what you're looking for?
          {/* <Link
            href="/contact"
            className="ml-1 font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Contact our support team
          </Link> */}
        </p>
      </div>
    </div>
  );
}
