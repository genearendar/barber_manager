"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Tenant } from "@/types/db";

// Shop status context
export const TenantContext = createContext<{
  name: Tenant["name"];
  slug: Tenant["slug"];
  settings: Tenant["settings"];
} | null>(null);

export default function TenantContextProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string | null;
}) {
  const [tenantData, setTenantData] = useState<{
    name: Tenant["name"];
    slug: Tenant["slug"];
    settings: Tenant["settings"];
  } | null>(null);

  // Get shop status from the client side. IMPORTANT not to mix with the same function in queries.ts file
  async function getTenant(): Promise<{
    name: Tenant["name"];
    slug: Tenant["slug"];
    settings: Tenant["settings"];
  } | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("name, slug, settings")
      .eq("id", tenantId)
      .single();
    if (error) {
      console.error("Error fetching tenant data:", error.message);
    }

    return data;
  }
  // Subscribe to shop settings updates realtime
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const tenant = await getTenant();
        setTenantData(tenant);
      } catch (error) {
        setTenantData(null);
        console.error("Error fetching tenant data:", error);
      }
    };
    let subscription: RealtimeChannel | null = null;

    const setupSubscription = async () => {
      const supabase = await createClient();
      subscription = supabase
        .channel("tenant_settings_changes")
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
              const newSettings = payload.new.settings as Tenant["settings"];
              console.log("Setting context state to ", newSettings);
              setTenantData(
                (prev) =>
                  ({
                    ...prev,
                    settings: newSettings,
                  }) as {
                    name: Tenant["name"];
                    slug: Tenant["slug"];
                    settings: Tenant["settings"];
                  } | null
              );
            }
          }
        )
        .subscribe();

      return subscription;
    };
    fetchSettings();
    setupSubscription();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <TenantContext.Provider value={tenantData}>
      {children}
    </TenantContext.Provider>
  );
}
