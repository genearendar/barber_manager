"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toggleServiceStatus } from "@/utils/supabase/actions";

export default function DashStartButton({
  queueEntryId,
  status,
  selectedBarberId,
}: {
  queueEntryId: number;
  status: string;
  selectedBarberId: number | null;
}) {
  async function handleClick() {
    await toggleServiceStatus(queueEntryId, status);
  }
  let buttonText = "Start";
  if (status === "in progress") {
    buttonText = "Finish";
  } else if (status === "finished") {
    buttonText = "Finished";
  } else if (status === "cancelled") {
    buttonText = "Cancelled";
  } else if (!selectedBarberId) {
    buttonText = " < Assign Barber";
  }
  let disabled = false;
  if (status === "finished" || status === "cancelled" || !selectedBarberId) {
    disabled = true;
  }
  return (
    <Button
      className={cn(
        "w-40 bg-green-600 hover:bg-green-500",
        status === "cancelled" && "bg-red-300",
        status === "finished" && "bg-blue-300"
      )}
      variant="default"
      onClick={handleClick}
      disabled={disabled}
    >
      {buttonText}{" "}
    </Button>
  );
}
