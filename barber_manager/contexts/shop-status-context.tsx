"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

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

  // Get shop status from the client side. IMPORTANT not to mix with the sam function in queries.ts file
  async function getShopStatus(): Promise<string | any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("settings")
      .eq("id", tenantId)
      .single();
    if (error) {
      console.error("Error fetching shop status:", error.message);
    }
    const status = data?.settings.is_open;
    console.log("Shop hook fetched data:", status);
    return status as boolean | null;
  }
  // Subscribe to shop status updates realtime
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const isOpen: boolean | null = await getShopStatus();
        setShopIsOpen(isOpen);
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
              const isOpen = newSettings.is_open;
              console.log("Setting context state to ", isOpen);
              setShopIsOpen(isOpen);
            }
          }
        )
        .subscribe();

      return subscription;
    };
    fetchStatus();
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
