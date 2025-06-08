"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import {
  getShopStatus,
  fetchTenantSettings,
  getTenantIdOrThrow,
} from "./queries";
import { Barber, QueueStatus, TableName, ServerActionReturn } from "@/types/db";

// Add a new queue entry
export async function addToQueue(
  formState: ServerActionReturn | null,
  formData: FormData
): Promise<ServerActionReturn> {
  const supabase = await createClient();

  // Extract form data
  const name = formData.get("name")?.toString().trim();
  const barberId = formData.get("barberSelection");
  const tenantId = await getTenantIdOrThrow();

  // Validation
  if (!name || name.length < 2) {
    return {
      success: false,
      message: "Name is required",
    };
  }

  if (name.length > 50) {
    return {
      success: false,
      message: "Name must be less than 50 characters",
    };
  }

  try {
    // Insert new queue entry
    const { data, error } = await supabase
      .from("queue")
      .insert({
        name: name,
        status: "waiting" as QueueStatus,
        barber_id: barberId ? (barberId as Barber["id"]) : null,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        message: "Failed to add to queue. Please try again.",
      };
    }

    // Revalidate the page to show updated data
    revalidatePath("/queue");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Thanks! You are in the queue now.",
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

// Assign a barber to a queue entry
export async function assignBarberToQueueEntry(
  queueEntryId: string,
  barberId: string
): Promise<ServerActionReturn> {
  const tenantId = await getTenantIdOrThrow();
  // Assign barberId to null in case it's not provided
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("queue")
      .update({ barber_id: barberId })
      .eq("id", queueEntryId)
      .eq("tenant_id", tenantId)
      .select();
    if (error) {
      console.error("Error updating barber:", error);
      return { success: false, message: "Failed to assign barber." };
    }

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Barber assigned successfully." };
  } catch (error) {
    console.error("Error assigning barber:", error);
    return { success: false, message: "Failed to assign barber." };
  }
}

// Update service status
export async function updateServiceStatus(
  queueEntryId: string,
  newStatus: string
): Promise<ServerActionReturn> {
  const supabase = await createClient();
  const tenantId = await getTenantIdOrThrow();
  try {
    const updates: {
      status: string;
      started_at?: Date | null;
      finished_at?: Date | null;
    } = {
      status: newStatus,
    };

    // Conditionally add timestamp updates based on the new status
    if (newStatus === "in progress") {
      updates.started_at = new Date(); // Set started_at to now
    } else if (newStatus === "finished") {
      updates.finished_at = new Date(); // Set finished_at to now
    } else if (newStatus === "cancelled" || newStatus === "waiting") {
      // For cancelled and waiting, set both timestamps to null
      updates.started_at = null;
      updates.finished_at = null;
    }
    const { data, error } = await supabase
      .from("queue")
      .update(updates)
      .eq("id", queueEntryId)
      .eq("tenant_id", tenantId)
      .select();
    if (error) {
      console.error("Error updating status:", error);
      return { success: false, message: "Failed to update status." };
    }
    revalidatePath("/admin/dashboard");
    revalidatePath("/queue");
    return { success: true, message: "Service status updated successfully." };
  } catch (error) {
    console.error("Error starting service:", error);
    return { success: false, message: "Failed to update status." };
  }
}

// Toggle staff status
export async function toggleStaffStatus(
  staffId: string,
  newStatus: string
): Promise<ServerActionReturn> {
  const tenantId = await getTenantIdOrThrow();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("barbers")
      .update({ status: newStatus })
      .eq("id", staffId)
      .eq("tenant_id", tenantId)
      .select();
    if (error) {
      console.error("Error updating staff status:", error);
      return { success: false, message: "Failed to update staff status." };
    }
    revalidatePath("/admin");
    revalidatePath("/admin/dashboard");
    revalidatePath("/queue");
    return {
      success: true,
      message: "Staff status updated successfully: " + newStatus,
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "Failed to update status." };
  }
}

// Toggle shop status to open or closed
export async function toggleShopStatus(): Promise<ServerActionReturn> {
  const tenantId = await getTenantIdOrThrow();

  try {
    const supabase = await createClient();
    const currentIsOpen = await getShopStatus();
    const newStatus = currentIsOpen === true ? false : true;
    const currentSettings = await fetchTenantSettings(tenantId);
    const newSettings = { ...currentSettings, is_open: newStatus };
    const { data, error } = await supabase
      .from("tenants")
      .update({ settings: newSettings })
      .eq("id", tenantId)
      .select();
    if (error) {
      console.error("Error updating shop status:", error);
      return { success: false, message: "Failed to update shop status." };
    }
    revalidatePath("/admin");
    revalidatePath("/admin/dashboard");
    revalidatePath("/queue");
    return { success: true, message: "Shop status updated successfully." };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "Failed to update status." };
  }
}
