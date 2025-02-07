import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50  bg-white px-4 py-2  w-full lg:w-[768px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold italic">logo</div>
        <button className="ml-4">
          <ShoppingCart className="h-6 w-6 lg:w-8 lg:h-8" />
        </button>
      </div>
    </header>
  );
}
