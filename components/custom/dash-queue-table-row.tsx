"use client";
import { cn } from "@/utils/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { QueueEntry, Barber } from "@/types/db";
import { useState, ChangeEvent } from "react";
import { assignBarberToQueueEntry } from "@/utils/supabase/actions";
import { Scissors } from "lucide-react";
import DashStartButton from "./dash-start-button";
import DashCancelButton from "./dash-cancel-button";
import DashReopenButton from "./dash-reopen-button";

export default function DashQueueTableRow({
  queueEntry,
  staffData,
  busyBarbers,
}: {
  queueEntry: QueueEntry;
  staffData: Barber[] | null | undefined;
  busyBarbers: (string | null)[] | undefined;
}) {
  /** Filter staffData for Select element to include only onsite staff and the current barber 
  (to preserve the name on disabled selects for finished entries) */

  const selectableStaff = staffData?.filter(
    (staff) => staff.status !== "offsite" || staff.id === queueEntry.barber_id
  );
  // State to track selected barber
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(
    queueEntry.barber_id
  );

  // Filter staffData for barbers on break (used to prevent barbers on break to start a job)
  const barbersOnBreak = staffData
    ?.filter((staff) => staff.status === "break")
    .map((staff) => staff.id);
  async function handleBarberSelectionChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const newSelectedBarberId = event.target.value || null;
    const previousSelectedBarberId = selectedBarberId; // Store current state value

    setSelectedBarberId(newSelectedBarberId); // Optimistically update UI

    try {
      const result = await assignBarberToQueueEntry(
        queueEntry.id,
        newSelectedBarberId as string
      );

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
    <TableRow className="grid align-middle grid-cols-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-20 sm:grid-cols-3 md:table-row md:rounded-none md:shadow-none md:backdrop-blur-none">
      <TableCell className="pb-0 text-lg font-bold self-center sm:order-first md:w-1/4 md:pb-4">
        {queueEntry.name}
      </TableCell>
      <TableCell className="pb-0 self-center justify-self-end md:justify-self-auto md:w-1/4 md:pb-4">
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
      <TableCell className="py-2 col-span-full self-center sm:col-span-1 sm:order-first sm:pt-4 md:w-1/4 md:pb-4">
        <select
          className="bg-accent text-sm p-3 px-5 rounded-md min-w-24"
          name="barberSelection"
          value={selectedBarberId ? selectedBarberId : ""}
          onChange={handleBarberSelectionChange}
          disabled={queueEntry.status !== "waiting"}
        >
          <option value="">-- No barber assigned --</option>
          {selectableStaff &&
            selectableStaff.map((barber) => (
              <option key={barber.id} value={barber.id}>
                ✂️ {barber.first_name}
              </option>
            ))}
        </select>
      </TableCell>
      <TableCell className="pt-2 md:w-1/4 md:pt-4">
        <div className="flex gap-6">
          <DashStartButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
            selectedBarberId={selectedBarberId}
            busyBarbers={busyBarbers}
            barbersOnBreak={barbersOnBreak}
          />
          <DashCancelButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
          />
          <DashReopenButton
            queueEntryId={queueEntry.id}
            status={queueEntry.status}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
