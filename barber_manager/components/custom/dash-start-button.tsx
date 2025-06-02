"use client";
import { cn } from "@/utils/utils";
import { Button } from "../ui/button";
import { toggleServiceStatus } from "@/utils/supabase/actions";
import UseAsyncAction from "@/hooks/use-async-action";

export default function DashStartButton({
  queueEntryId,
  status,
  selectedBarberId,
  busyBarbers,
}: {
  queueEntryId: number;
  status: string;
  selectedBarberId: number | null;
  busyBarbers: (number | null)[] | undefined;
}) {
  const {
    execute: toggleService,
    isLoading,
    isSuccess,
    message,
  } = UseAsyncAction(toggleServiceStatus);
  const barberIsBusy = busyBarbers?.includes(selectedBarberId || 0) || false;
  // Text logic
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
  // Enabled logic. The button should be disabled if
  // the status is finished, cancelled, no barber is selected,
  // can't start if selected barber is busy (only one job at a time)
  let disabled = false;
  if (
    status === "finished" ||
    status === "cancelled" ||
    !selectedBarberId ||
    (barberIsBusy && status === "waiting")
  ) {
    disabled = true;
  }
  // Visisbility logic
  let visible = true;
  if (status === "finished" || status === "cancelled") {
    visible = false;
  }
  return (
    visible && (
      <>
        <Button
          className={cn(
            "w-40 bg-green-600 hover:bg-green-500",
            status === "cancelled" && "bg-red-300",
            status === "finished" && "bg-blue-300"
          )}
          variant="default"
          onClick={() => toggleService(queueEntryId, status)}
          disabled={disabled || isLoading}
        >
          {buttonText}
        </Button>
        {isSuccess === false && (
          <p className="text-xs text-red-500">{message}</p>
        )}
      </>
    )
  );
}
