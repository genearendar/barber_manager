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
  const busyBarbers = realtimeQueue?.filter(
    (entry) => entry.status === "in progress"
  ).map((entry) => entry.barber_id);
  // Sort queue entries by status and create elements
  const statusOrder = ["in progress", "waiting", "finished", "cancelled"];
  const queueElements = realtimeQueue
    ?.sort((a, b) => {
      const aIndex = statusOrder.indexOf(a.status);
      const bIndex = statusOrder.indexOf(b.status);
      return aIndex - bIndex;
    })
    ?.map((queueElement) => {
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
