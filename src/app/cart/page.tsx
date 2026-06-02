import CartPage from "@/components/cart/CartPage";
import { retrieveCart } from "@lib/data/cart";

export default async function Page() {
  const cart = await retrieveCart();

  return <CartPage cart={cart} />;
}