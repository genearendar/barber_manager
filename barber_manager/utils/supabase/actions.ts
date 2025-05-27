"use server";
import { AnyARecord } from "node:dns";
import { createClient } from "./server";
import { revalidatePath } from "next/cache";

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

    // Revalidate the queue page to show updated data
    revalidatePath("/queue");
    revalidatePath("/dashboard");

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
