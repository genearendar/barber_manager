"use client";
import { QueueEntry, Barber } from "@/types/db";
import { cn, calculateWaitTime } from "@/utils/utils";
import useQueueRealtime from "@/hooks/use-queue-realtime";
export default function QueueContainer({
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
  const queueElements = realtimeQueue?.map((entry, index) => {
    return (
      <div
        key={entry.id}
        className={cn(
          "w-96 bg-accent text-sm p-3 px-5 rounded-md",
          entry.status === "waiting" ? "bg-yellow-500" : "bg-green-500"
        )}
      >
        <p className="text-2xl">{entry.name}</p>
        <p>{entry.status}</p>
        <p className="text-md text-right">
          Wait time: {calculateWaitTime(realtimeStaff, index)}
        </p>
      </div>
    );
  });
  return <div className="flex flex-col gap-2">{queueElements}</div>;
}
