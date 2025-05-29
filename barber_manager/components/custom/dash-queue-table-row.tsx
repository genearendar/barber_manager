"use client";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { QueueEntry, Barber } from "@/types/db";
import { useState, ChangeEvent } from "react";
import { assignBarberToQueueEntry } from "@/utils/supabase/actions";
import DashStartButton from "./dash-start-button";

export default function DashQueueTableRow({
  queueEntry,
  staffData,
}: {
  queueEntry: QueueEntry;
  staffData: Barber[] | null;
}) {
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(
    queueEntry.barber_id
  );
  async function handleBarberSelectionChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const newSelectedBarberId =
      Number(event.target.value) > 0 ? Number(event.target.value) : null;
    const previousSelectedBarberId = selectedBarberId; // Store current state value

    setSelectedBarberId(newSelectedBarberId); // Optimistically update UI

    try {
      console.log(
        `Attempting to assign barber ${newSelectedBarberId} to entry ${queueEntry.id}`
      );
      const result = await assignBarberToQueueEntry(
        queueEntry.id as number,
        newSelectedBarberId as number
      );
      console.log("Assignment result:", result);

      if (!result.success) {
        // Revert on failure
        alert(
          "Failed to assign barber: " + (result.message || "Unknown error")
        );
        setSelectedBarberId(previousSelectedBarberId);
      }
    } catch (error) {
      console.error("Error calling assignBarberToQueueEntry:", error);
      alert("An unexpected error occurred while assigning the barber.");
      setSelectedBarberId(previousSelectedBarberId); // Revert on error
    }
  }

  return (
    <TableRow>
      <TableCell className="w-1/6 font-medium">{queueEntry.name}</TableCell>
      <TableCell className="w-1/6 font-medium">
        <span
          className={cn("block w-24 p-2 rounded-md text-center", {
            "bg-yellow-500": queueEntry.status === "waiting",
            "bg-green-500": queueEntry.status === "in progress",
            "bg-blue-500": queueEntry.status === "finished",
            "bg-red-500": queueEntry.status === "cancelled",
          })}
        >
          {queueEntry.status}
        </span>
      </TableCell>
      <TableCell className="w-1/5 font-medium">
        <select
          className="bg-accent text-sm p-3 px-5 rounded-md w-full"
          value={selectedBarberId ? selectedBarberId : ""}
          onChange={handleBarberSelectionChange}
          disabled={queueEntry.status !== "waiting"}
        >
          <option value="">-- Select Barber --</option>
          {staffData &&
            staffData.map((barber) => (
              <option key={barber.id} value={barber.id as number}>
                {barber.first_name}
              </option>
            ))}
        </select>
      </TableCell>
      <TableCell className="w-1/5 font-medium">
        <div className="flex gap-10">
          <DashStartButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
            selectedBarberId={selectedBarberId}
          />
          <button>Cancel</button>
        </div>
      </TableCell>
    </TableRow>
  );
}
