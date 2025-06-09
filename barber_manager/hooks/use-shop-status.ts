import { useContext } from "react";
import { TenantContext } from "@/contexts/tenant-context";

export default function useShopStatus() {
  const tenantContext = useContext(TenantContext);
  const shopIsOpen = tenantContext?.settings?.is_open;

  if (shopIsOpen === undefined) {
    throw new Error(
      "useShopStatus must be used within a TenantContextProvider"
    );
  }
  return shopIsOpen;
}
