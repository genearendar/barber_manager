"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Tenant, ClientTenant } from "@/types/db";

// Shop status context
export const TenantContext = createContext<ClientTenant | null>(null);

export default function TenantContextProvider({
  children,
  tenantData,
}: {
  children: React.ReactNode;
  tenantData: ClientTenant;
}) {
  const [tenant, setTenant] = useState<ClientTenant>(tenantData);

  // Get shop status from the client side. IMPORTANT not to mix with the same function in queries.ts file
  // async function getTenant(): Promise<{
  //   name: Tenant["name"];
  //   slug: Tenant["slug"];
  //   settings: Tenant["settings"];
  // } | null> {
  //   const supabase = await createClient();
  //   const { data, error } = await supabase
  //     .from("tenants")
  //     .select("name, slug, settings")
  //     .eq("id", tenantId)
  //     .single();
  //   if (error) {
  //     console.error("Error fetching tenant data:", error.message);
  //   }

  //   return data;
  // }
  // Subscribe to shop settings updates realtime
  useEffect(() => {
    setTenant(tenantData);

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
            filter: `id=eq.${tenant.id}`,
          },
          (payload) => {
            if (payload.new) {
              const newSettings = payload.new.settings as Tenant["settings"];
              console.log("Setting context state to ", newSettings);
              setTenant(
                (prev) =>
                  ({
                    ...prev,
                    settings: newSettings,
                  }) as ClientTenant
              );
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
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}
