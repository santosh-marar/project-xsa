import CartManager from "@/components/custom/cart-manager";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { HydrateClient } from "@/trpc/server";

const CartPage = () => {
  return (
    <HydrateClient>
      <SecondaryNavbar  />
      <CartManager />
    </HydrateClient>
  );
};

export default CartPage;
