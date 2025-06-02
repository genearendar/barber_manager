"use client";
import { cn } from "@/utils/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { QueueEntry, Barber } from "@/types/db";
import { useState, ChangeEvent } from "react";
import { assignBarberToQueueEntry } from "@/utils/supabase/actions";
import DashStartButton from "./dash-start-button";
import DashCancelButton from "./dash-cancel-button";

export default function DashQueueTableRow({
  queueEntry,
  staffData,
}: {
  queueEntry: QueueEntry;
  staffData: Barber[] | null | undefined;
}) {
  /** Filter staffData for Select element to include only onsite staff and the current barber 
  (to preserve the name on disabled selects for finished entries) */
  const selectableStaff = staffData?.filter(
    (staff) => staff.status !== "offsite" || staff.id === queueEntry.barber_id
  );

  // State to track selected barber
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
          <option value="">-- No barber assigned --</option>
          {selectableStaff &&
            selectableStaff.map((barber) => (
              <option key={barber.id} value={barber.id as number}>
                {barber.first_name}
              </option>
            ))}
        </select>
      </TableCell>
      <TableCell className="w-1/5 font-medium">
        <div className="flex gap-6">
          <DashStartButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
            selectedBarberId={selectedBarberId}
          />
          <DashCancelButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
