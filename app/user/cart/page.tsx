import CartManager from "@/components/custom/cart-manager";
import { Footer } from "@/components/custom/footer";
import SecondaryNavbar from "@/components/custom/secondary-navbar";
import { HydrateClient } from "@/trpc/server";

const CartPage = () => {
  return (
    <HydrateClient>
      <SecondaryNavbar pageName="Cart" />

      <CartManager />
    </HydrateClient>
  );
};

export default CartPage;
