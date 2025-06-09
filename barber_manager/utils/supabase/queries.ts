import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { QueueEntry, Barber, TenantSettings, Tenant, User } from "@/types/db";

// Get tenant ID
export async function getTenantIdOrThrow(): Promise<Tenant["id"]> {
  const headersResult = await headers();
  const tenantId = headersResult.get("x-tenant-id");
  if (!tenantId) {
    throw new Error(
      "Missing tenant ID. This operation requires tenant context."
    );
  }
  return tenantId;
}

/**
 * Fetches the settings for the current tenant from the database.
 * @returns A Promise that resolves to the TenantSettings object, or null if not found.
 * @throws An error if the tenant ID is missing or a database error occurs.
 */
// Get any tenant's settings
export async function fetchTenantSettings(
  tenantId: Tenant["id"] | null
): Promise<TenantSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select("settings") // Select the jsonb 'settings' column
    .eq("id", tenantId) // Filter by the tenant's ID
    .single();

  if (error) {
    console.error("Supabase error fetching tenant settings:", error.message);
    throw new Error("Database error: Failed to retrieve tenant settings.");
  }

  // If no data is found (e.g., tenantId doesn't exist), or settings is null
  if (!data || !data.settings) {
    console.warn(`No settings found for tenant ID: ${tenantId}`);
    return null; // Return null if no settings or tenant not found
  }

  return data.settings as TenantSettings;
}

// Get any tenant's data
export async function fetchTenant(
  tenantId: Tenant["id"] | null
): Promise<Tenant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select("*") // All columns
    .eq("id", tenantId) // Filter by the tenant's ID
    .single();

  if (error) {
    console.error("Supabase error fetching tenant data:", error.message);
    throw new Error("Database error: Failed to retrieve tenant data.");
  }

  // If no data is found (e.g., tenantId doesn't exist), or settings is null
  if (!data) {
    console.warn(`No tenant found for tenant ID: ${tenantId}`);
    return null; // Return null if no settings or tenant not found
  }

  return data as Tenant;
}

export async function fetchUser(userId: string): Promise<User | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Supabase error fetching user data:", error.message);
    return null;
  }
  return data as User;
}

// Fetch all queue entries
export async function getAllQueue(): Promise<QueueEntry[] | null> {
  const tenantId = await getTenantIdOrThrow();

  const supabase = await createClient(); // Initialize your server-side Supabase client

  // Select all necessary columns
  const { data: queue, error } = await supabase
    .from("queue")
    .select("id, name, created_at, status, started_at, finished_at, barber_id") // Select all columns from your table
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true }); // Order by creation time

  if (error) {
    console.error("Error fetching active queue:", error.message);
    return null;
  }
  // Ensure 'queue' is an array of the correct type
  return queue as QueueEntry[];
}

// Fetch all current staff
export async function getAllCurrentStaff(): Promise<Barber[] | null> {
  const tenantId = await getTenantIdOrThrow();

  const supabase = await createClient();
  const { data: staff, error } = await supabase
    .from("barbers")
    .select("id, first_name, last_name, status")
    .eq("is_current", true)
    .eq("tenant_id", tenantId)
    .order("first_name", { ascending: true });
  if (error) {
    console.error("Error fetching staff:", error.message);
  }
  return staff;
}

// // Fetch available staff
// export async function getAvailableStaff(): Promise<Barber[] | null> {
//   const headersResult = await headers();
//   const tenantId = headersResult.get("x-tenant-id");
//   const supabase = await createClient();
//   const { data: staff, error } = await supabase
//     .from("barbers")
//     .select("id, first_name, last_name, status")
//     .eq("status", "onsite")
//     .eq("tenant_id", tenantId)
//     .order("first_name", { ascending: true });
//   if (error) {
//     console.error("Error fetching staff:", error.message);
//   }
//   return staff;
// }

// Get shop status
export async function getShopStatus(): Promise<boolean | null> {
  const tenantId = await getTenantIdOrThrow();
  const tenantSettings = await fetchTenantSettings(tenantId);

  // If no data is found (e.g., tenantId doesn't exist), or settings is null
  if (!tenantSettings) {
    console.warn(`No settings found for tenant ID: ${tenantId}`);
    return null;
  }

  // Return the 'is_open' property. Default to false if it's missing or not a boolean.
  return typeof tenantSettings.is_open === "boolean"
    ? tenantSettings.is_open
    : null;
}
