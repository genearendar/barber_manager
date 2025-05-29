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
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashQueueTable({
  queueData,
  staffData,
}: {
  queueData: QueueEntry[] | null;
  staffData: Barber[] | null;
}) {
  const [queueEntries, setQueueEntries] = useState<
    QueueEntry[] | null | undefined
  >(queueData);

  useEffect(() => {
    const supabase = createClient();
    const subscription = supabase
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("New entry:", payload.new);
            setQueueEntries((prevQueueEntries) => [
              ...(prevQueueEntries ?? []),
              payload.new as QueueEntry,
            ]);
          } else if (payload.eventType === "DELETE") {
            console.log("Entry deleted:", payload.old);
            setQueueEntries((prevQueueEntries) =>
              prevQueueEntries?.filter((entry) => entry.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            console.log("Entry updated:", payload.new);
            setQueueEntries((prevQueueEntries) =>
              prevQueueEntries?.map((entry) => {
                return entry.id === payload.new.id ? payload.new as QueueEntry : entry;
              })
            );
          }
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const queueElements = queueEntries?.map((queueElement) => {
    return (
      <DashQueueTableRow
        queueEntry={queueElement}
        staffData={staffData}
        key={queueElement.id}
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
