"use client";
import { QueueEntry } from "@/types/db";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
export default function QueueContainer({
  queueData,
}: {
  queueData: QueueEntry[] | null;
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
                return entry.id === payload.new.id
                  ? (payload.new as QueueEntry)
                  : entry;
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

  const queueElements = queueEntries?.map((entry) => {
    // Extra check to filter out entries that are not waiting or in progress
    if (entry.status !== "waiting" && entry.status !== "in progress")
      return null;
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
        <p className="text-md text-right">Wait time: 15 minutes</p>
      </div>
    );
  });
  return <div className="flex flex-col gap-2">{queueElements}</div>;
}
