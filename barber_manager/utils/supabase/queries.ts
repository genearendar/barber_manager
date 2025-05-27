import { createClient } from "@/utils/supabase/server";
import { QueueEntry } from "@/types/db";
import { revalidatePath } from "next/cache";

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
    .in("status", ["waiting", "in_progress"]) // Filter by active statuses
    .order("created_at", { ascending: true }); // Order by creation time

  if (error) {
    console.error("Error fetching active queue:", error.message);
    // or return an empty array/null. Returning null is generally safer for UI.
    return null;
  }
  // Ensure 'queue' is an array of the correct type
  console.log(queue);
  return queue as QueueEntry[];
}
