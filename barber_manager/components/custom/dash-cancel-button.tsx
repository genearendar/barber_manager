"use client";
import { Button } from "../ui/button";
import { cancelQueueEntry } from "@/utils/supabase/actions";

export default function DashCancelButton({
  queueEntryId,
  status,
}: {
  queueEntryId: number;
  status: string;
}) {
  async function handleClick() {
    await cancelQueueEntry(queueEntryId);
  }

  let visible = true;
  if (status === "finished" || status === "cancelled") {
    visible = false;
  }

  return (
    visible && (
      <Button className="bg-red-500 hover:bg-red-400" variant="default" onClick={handleClick}>
        Cancel
      </Button>
    )
  );
}
