"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { QueueEntry, Barber } from "@/types/db";
export default function useQueueRealtime(
  initialQueue: QueueEntry[] | null | undefined,
  initialStaff: Barber[] | null | undefined
) {
  const [realtimeQueue, setRealtimeQueue] = useState(initialQueue);
  const [realtimeStaff, setRealtimeStaff] = useState(initialStaff);

  const supabase = createClient();

  useEffect(() => {
    const queueSubscription = supabase
      .channel("queue_realtime")
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
            setRealtimeQueue((prev) => [
              ...(prev ?? []),
              payload.new as QueueEntry,
            ]);
          } else if (payload.eventType === "DELETE") {
            console.log("Entry deleted:", payload.old);
            setRealtimeQueue((prev) =>
              prev?.filter((entry) => entry.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            console.log("Entry updated:", payload.new);
            setRealtimeQueue((prev) =>
              prev?.map((entry) => {
                return entry.id === payload.new.id
                  ? (payload.new as QueueEntry)
                  : entry;
              })
            );
          }
        }
      )
      .subscribe();

    // Staff subscription...
    const staffSubscription = supabase
      .channel("staff_realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "staff",
        },
        (payload) => {
          console.log("Staff entry updated:", payload.new);
          setRealtimeStaff((prev) =>
            prev?.map((staff) =>
              staff.id === payload.new.id ? (payload.new as Barber) : staff
            )
          );
        }
      )
      .subscribe();
    return () => {
      queueSubscription.unsubscribe();
      staffSubscription.unsubscribe();
    };
  }, []);

  return { realtimeQueue, realtimeStaff };
}
