import { useContext } from "react";
import { ShopStatusContext } from "@/contexts/shop-status-context";

export function useShopStatus() {
  const shopIsOpen = useContext(ShopStatusContext);

  if (shopIsOpen === undefined) {
    throw new Error("useShopStatus must be used within a ShopStatusProvider");
  }
  return shopIsOpen;
}
