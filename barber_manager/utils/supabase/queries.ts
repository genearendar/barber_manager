import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { QueueEntry } from "@/types/db";
import { Barber } from "@/types/db";

// Get current tenant id
export async function getCurrentTenantId(): Promise<string> {
  const headerResult = await headers();
  const slug = headerResult.get("x-tenant-slug");
  if (!slug) throw new Error("Missing tenant slug");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) throw new Error("Invalid tenant");

  return data.id as string;
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
