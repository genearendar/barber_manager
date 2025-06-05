"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueueEntry, Barber } from "@/types/db";
import DashQueueTableRow from "./dash-queue-table-row";
import useQueueRealtime from "@/hooks/use-queue-realtime";

export default function DashQueueTable({
  queueData,
  staffData,
}: {
  queueData: QueueEntry[] | null;
  staffData: Barber[] | null;
}) {
  const { realtimeQueue, realtimeStaff } = useQueueRealtime(
    queueData,
    staffData
  );
  //Get busy barbers to pass this on to the start button
  const busyBarbers = realtimeQueue
    ?.filter((entry) => entry.status === "in progress")
    .map((entry) => entry.barber_id);
  // Sort queue entries by status and create elements
  const STATUS_ORDER = ["in progress", "waiting", "finished", "cancelled"];
  const queueElements = realtimeQueue
    ?.sort((a, b) => {
      const aStatusIndex = STATUS_ORDER.indexOf(a.status);
      const bStatusIndex = STATUS_ORDER.indexOf(b.status);

      // Primary sort: by status category (e.g., all 'in progress' come before 'waiting')
      if (aStatusIndex !== bStatusIndex) {
        return aStatusIndex - bStatusIndex;
      }

      // Secondary sort: if statuses are the same, sort by created_at (oldest first)
      // Assuming `created_at` is a string or Date object that can be directly compared
      // If it's a string, ensure it's in a sortable format like ISO 8601 (e.g., "2023-10-26T10:00:00Z")
      if (a.created_at < b.created_at) {
        return -1; // 'a' comes before 'b'
      }
      if (a.created_at > b.created_at) {
        return 1; // 'b' comes before 'a'
      }

      return 0; // Entries are identical in status and created_at order
    })
    .map((queueElement) => {
      return (
        <DashQueueTableRow
          queueEntry={queueElement}
          staffData={realtimeStaff}
          key={queueElement.id}
          busyBarbers={busyBarbers}
        />
      );
    });

  return (
    <Table>
      <TableCaption>Today's queue</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Barber</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{queueElements}</TableBody>
    </Table>
  );
}
