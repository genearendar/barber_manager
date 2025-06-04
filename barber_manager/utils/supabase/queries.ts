import { createClient } from "@/utils/supabase/server";
import { QueueEntry } from "@/types/db";
import { Barber } from "@/types/db";

// Fetch the current tenant ID
const SINGLE_TENANT_ID = process.env.NEXT_PUBLIC_SINGLE_TENANT_ID;
export function getCurrentTenantId(): string {
  // In a real multi-tenant app, this would get the tenant_id
  // from headers, session, or request context set by middleware
  // based on the URL slug, subdomain, or user session.

  // For now, we return the ID of your single tenant.
  if (!SINGLE_TENANT_ID) {
    console.error("Error. No tenant ID found.");
    throw new Error("No tenant ID found.");
  }
  console.log("Tenant id:", SINGLE_TENANT_ID);
  return SINGLE_TENANT_ID;
}

// Fetch all queue entries
export async function getAllQueue(): Promise<QueueEntry[] | null> {
  const supabase = await createClient(); // Initialize your server-side Supabase client

  // Select all necessary columns
  const { data: queue, error } = await supabase
    .from("queue")
    .select("id, name, created_at, status, started_at, finished_at, barber_id") // Select all columns from your table
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
  const supabase = await createClient();
  const { data: staff, error } = await supabase
    .from("barbers")
    .select("id, first_name, last_name, status")
    .eq("is_current", true)
    .order("first_name", { ascending: true });
  if (error) {
    console.error("Error fetching staff:", error.message);
  }
  return staff;
}

// Fetch available staff
export async function getAvailableStaff(): Promise<Barber[] | null> {
  const supabase = await createClient();
  const { data: staff, error } = await supabase
    .from("barbers")
    .select("id, first_name, last_name, status")
    .eq("status", "onsite")
    .order("first_name", { ascending: true });
  if (error) {
    console.error("Error fetching staff:", error.message);
  }
  return staff;
}

// Get shop status
export async function getShopStatus(): Promise<string | any> {
  const supabase = await createClient();
  const { data: isOpen, error } = await supabase
    .from("business_settings")
    .select("value")
    .eq("key", "is_open")
    .single();
  if (error) {
    console.error("Error fetching shop status:", error.message);
  }
  return isOpen?.value as string | null;
}
