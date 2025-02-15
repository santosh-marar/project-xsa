import CartManager from "@/components/custom/cart-manager";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { HydrateClient } from "@/trpc/server";

const CartPage = () => {
  return (
    <HydrateClient>
      <SecondaryNavbar />

      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <CartManager />
      </div>
    </HydrateClient>
  );
};

export default CartPage;
