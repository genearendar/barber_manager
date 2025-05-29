"use client";
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
  function handleClick() {
    toggleServiceStatus(queueEntryId, status);
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
      className="w-40"
      variant="default"
      onClick={handleClick}
      disabled={disabled}
    >
      {buttonText}{" "}
    </Button>
  );
}
