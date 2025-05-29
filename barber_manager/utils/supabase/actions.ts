"use server";
import { AnyARecord } from "node:dns";
import { createClient } from "./server";
import { revalidatePath } from "next/cache";

// Add a new queue entry
export async function addToQueue(formData: FormData): Promise<any> {
  const supabase = await createClient();

  // Extract form data
  const name = formData.get("name")?.toString().trim();

  // Validation
  if (!name || name.length < 2) {
    return {
      error: "Name is required",
    };
  }

  if (name.length > 50) {
    return {
      error: "Name must be less than 50 characters",
    };
  }

  try {
    // Insert new queue entry
    const { data, error } = await supabase
      .from("queue")
      .insert({
        name: name,
        status: "waiting",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return {
        error: "Failed to add to queue. Please try again.",
      };
    }

    // Revalidate the page to show updated data
    revalidatePath("/queue");
    revalidatePath("/protected/dashboard");

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}

// Assign a barber to a queue entry
export async function assignBarberToQueueEntry(
  queueEntryId: number,
  barberId: number
): Promise<any> {
  // Assign barberId to null in case it's not provided
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("queue")
      .update({ barber_id: barberId })
      .eq("id", queueEntryId)
      .select();
    if (error) {
      console.error("Error updating barber:", error);
      return { success: false, message: "Failed to assign barber." };
    }

    revalidatePath("/protected/dashboard");
    return { success: true, message: "Barber assigned successfully." };
  } catch (error) {
    console.error("Error assigning barber:", error);
    return { success: false, message: "Failed to assign barber." };
  }
}

// Start and finish service
export async function toggleServiceStatus(
  queueEntryId: number,
  status: string
): Promise<any> {
  try {
    const supabase = await createClient();
    const statusToUpdate =
      status === "in progress" ? "finished" : "in progress";
    const { data, error } = await supabase
      .from("queue")
      .update({ status: statusToUpdate })
      .eq("id", queueEntryId)
      .select();
    if (error) {
      console.error("Error updating status:", error);
      return { success: false, message: "Failed to update status." };
    }
    revalidatePath("/protected/dashboard");
    revalidatePath("/queue");
    return {
      success: true,
      message: "Status updated successfully: " + statusToUpdate,
    };
  } catch (error) {
    console.error("Error starting service:", error);
    return { success: false, message: "Failed to update status." };
  }
}

// Cancel query item
export async function cancelQueueEntry(queueEntryId: number): Promise<any> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("queue")
      .update({ status: "cancelled" })
      .eq("id", queueEntryId)
      .select();
    if (error) {
      console.error("Error updating status:", error);
      return { success: false, message: "Failed to update status." };
    }
    revalidatePath("/protected/dashboard");
    revalidatePath("/queue");
    return { success: true, message: "Entry cancelled successfully." };
  } catch (error) {
    console.error("Error starting service:", error);
    return { success: false, message: "Failed to update status." };
  }
}
