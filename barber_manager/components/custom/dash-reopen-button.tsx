"use client";
import { cn } from "@/utils/utils";
import { Button } from "../ui/button";
import { updateServiceStatus } from "@/utils/supabase/actions";
import UseAsyncAction from "@/hooks/use-async-action";
import { QueueEntry } from "@/types/db";

export default function DashReopenButton({
  queueEntryId,
  status,
}: {
  queueEntryId: QueueEntry["id"];
  status: string;
}) {
  const {
    execute: toggleService,
    isLoading,
    isSuccess,
    message,
  } = UseAsyncAction(updateServiceStatus);

  // Visisbility logic
  let visible = false;
  if (status === "finished" || status === "cancelled") {
    visible = true;
  }
  return (
    visible && (
      <>
        <Button
          className={cn("w-fit text-blue-600")}
          variant="link"
          onClick={() => toggleService(queueEntryId, "waiting")}
          disabled={isLoading}
        >
          Reopen
        </Button>
        {isSuccess === false && (
          <p className="text-xs text-red-500">{message}</p>
        )}
      </>
    )
  );
}
