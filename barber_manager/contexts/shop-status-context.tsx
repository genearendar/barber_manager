"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

// Shop status context
export const ShopStatusContext = createContext<string | null>(null);

export default function ShopStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shopIsOpen, setShopIsOpen] = useState<string | null>(null);
  async function getShopStatus(): Promise<string | any> {
    const supabase = await createClient();
    const { data: status, error } = await supabase
      .from("business_settings")
      .select("value")
      .eq("key", "is_open")
      .single();
    if (error) {
      console.error("Error fetching shop status:", error.message);
    }
    return status?.value as string | null;
  }
  // Subscribe to shop status updates realtime
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const isOpen: string | null = await getShopStatus();
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
            table: "business_settings",
            filter: "key=eq.is_open",
          },
          (payload) => {
            if (payload.new) {
              const isOpen = payload.new.value;
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
