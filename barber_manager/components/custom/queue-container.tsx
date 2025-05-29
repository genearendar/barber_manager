"use client";
import { QueueEntry } from "@/types/db";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
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
          }
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const queueElements = queueEntries?.map((person) => {
    return (
      <div key={person.id} className="bg-accent text-sm p-3 px-5 rounded-md">
        <p className="text-xl">{person.name}</p>
        <p className="text-xs text-right">Wait time: 15 minutes</p>
      </div>
    );
  });
  return <div className="flex flex-col gap-2">{queueElements}</div>;
}
