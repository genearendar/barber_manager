import { createClient } from "@/utils/supabase/server";
import { QueueEntry } from "@/types/db";
import { Barber } from "@/types/db";

/**
 * Fetches the queue entries that are currently 'waiting' or 'in_progress'.
 * The results are ordered by their creation timestamp in ascending order.
 */
export async function getActiveQueue(): Promise<QueueEntry[] | null> {
  const supabase = await createClient(); // Initialize your server-side Supabase client

  // Select all necessary columns
  const { data: queue, error } = await supabase
    .from("queue")
    .select(
      "id, name, created_at, status, started_at, finished_at, barber_name"
    ) // Select all columns from your table
    .in("status", ["waiting", "in progress"]) // Filter by active statuses
    .order("created_at", { ascending: true }); // Order by creation time

  if (error) {
    console.error("Error fetching active queue:", error.message);
    // or return an empty array/null. Returning null is generally safer for UI.
    return null;
  }
  // Ensure 'queue' is an array of the correct type
  return queue as QueueEntry[];
}

export async function getAllQueue(): Promise<QueueEntry[] | null> {
  const supabase = await createClient(); // Initialize your server-side Supabase client

  // Select all necessary columns
  const { data: queue, error } = await supabase
    .from("queue")
    .select(
      "id, name, created_at, status, started_at, finished_at, barber_name"
    ) // Select all columns from your table
    .order("created_at", { ascending: true }); // Order by creation time


  if (error) {
    console.error("Error fetching active queue:", error.message);
    // or return an empty array/null. Returning null is generally safer for UI.
    return null;
  }
  // Ensure 'queue' is an array of the correct type
  return queue as QueueEntry[];
}

export async function getStaff(): Promise<Barber[] | null> {
  const supabase = await createClient();
  const { data: staff, error } = await supabase.from("staff").select("id, first_name, last_name, status");
  if (error) {
    console.error("Error fetching staff:", error.message);
  }
  return staff;
}