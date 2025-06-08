"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getShopStatus } from "@/utils/supabase/queries";

// Shop status context
export const ShopStatusContext = createContext<boolean | null>(null);

export default function ShopStatusProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string | null;
}) {
  const [shopIsOpen, setShopIsOpen] = useState<boolean | null>(null);

  // Subscribe to shop status updates realtime
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const shopIsOpen: boolean | null = await getShopStatus(tenantId);
        setShopIsOpen(shopIsOpen ? shopIsOpen : null);
      } catch (error) {
        setShopIsOpen(null);
        console.error("Error fetching shop status:", error);
      }
    };
    let subscription: RealtimeChannel | null = null;
    const setupSubscription = async () => {
      const supabase = await createClient();
      subscription = supabase
        .channel("business_settings_changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "tenants",
            filter: `id=eq.${tenantId}`,
          },
          (payload) => {
            if (payload.new) {
              const newSettings = payload.new.settings;
              // Ensure newSettings is an object and has the 'is_open' property
              if (newSettings && typeof newSettings.is_open === "boolean") {
                const isOpen = newSettings.is_open;
                setShopIsOpen(isOpen);
              } else {
                // Handle cases where settings or is_open might be missing or malformed
                console.warn(
                  "Received update, but 'is_open' was not found or not a boolean in settings:",
                  payload.new
                );
              }
            }
          }
        )
        .subscribe();

      return subscription;
    };

    setupSubscription();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ShopStatusContext.Provider value={shopIsOpen}>
      {children}
    </ShopStatusContext.Provider>
  );
}
