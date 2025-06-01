import { useContext } from "react";
import { ShopStatusContext } from "@/contexts/shop-status-context";

export function useShopStatus() {
  const context = useContext(ShopStatusContext);

  if (context === undefined) {
    throw new Error("useShopStatus must be used within a ShopStatusProvider");
  }

  return context;
}
