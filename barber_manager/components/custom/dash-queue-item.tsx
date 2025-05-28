"use client";
import { cn } from "@/lib/utils";
import { QueueEntry, Barber } from "@/types/db";
export default function DashQueueItem({
  person,
  staffData,
}: {
  person: QueueEntry;
  staffData: Barber[] | null;
}) {
  return (
    <div className="flex gap-2">
      <div
        className={cn("flex-1 text-sm p-3 px-5 rounded-md", {
          "bg-yellow-500": person.status === "waiting",
          "bg-green-500": person.status === "in progress",
          "bg-blue-500": person.status === "finished",
          "bg-red-500": person.status === "cancelled",
        })}
      >
        <p className="text-xl">{person.name}</p>
        <p className="text-xs text-right">{person.status}</p>
      </div>
      <div className="">
        <button className="bg-accent text-sm p-3 px-5 rounded-md">
          Assign
        </button>
      </div>
    </div>
  );
}
