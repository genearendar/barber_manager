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

export default function DashQueueTable({
  queueData,
  staffData,
}: {
  queueData: QueueEntry[] | null;
  staffData: Barber[] | null;
}) {
  const queueEntries = queueData?.map((person) => {
    return (
      <DashQueueTableRow
        person={person}
        staffData={staffData}
        key={person.id}
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
      <TableBody>{queueEntries}</TableBody>
    </Table>
  );
}
