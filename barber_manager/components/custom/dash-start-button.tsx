"use client";
import { cn } from "@/utils/utils";
import { Button } from "../ui/button";
import { updateServiceStatus } from "@/utils/supabase/actions";
import UseAsyncAction from "@/hooks/use-async-action";
import { Barber, QueueEntry } from "@/types/db";

export default function DashStartButton({
  queueEntryId,
  status,
  selectedBarberId,
  busyBarbers,
  barbersOnBreak,
}: {
  queueEntryId: QueueEntry["id"];
  status: QueueEntry["status"];
  selectedBarberId: Barber["id"] | null;
  busyBarbers: (Barber["id"] | null)[] | undefined;
  barbersOnBreak: Barber["id"][] | undefined;
}) {
  const {
    execute: updateService,
    isLoading,
    isSuccess,
    message,
  } = UseAsyncAction(updateServiceStatus);
  const barberIsBusy = busyBarbers?.includes(selectedBarberId) || false;
  const barberIsOnBreak =
    (selectedBarberId && barbersOnBreak?.includes(selectedBarberId)) || false;
  // Text logic
  let buttonText = "Start";
  if (status === "in progress") {
    buttonText = "Finish";
  }
  // Enabled logic. The button should be disabled if
  // the status is finished, cancelled, no barber is selected,
  // can't start if selected barber is busy (only one job at a time)
  // or if selected barber is on break
  let disabled = false;
  if (
    status === "finished" ||
    status === "cancelled" ||
    !selectedBarberId ||
    (barberIsOnBreak && status === "waiting") ||
    // cannot start if selected barber is busy
    (barberIsBusy && status === "waiting") ||
    isLoading
  ) {
    disabled = true;
  }
  // Visisbility logic
  let visible = true;
  if (status === "finished" || status === "cancelled") {
    visible = false;
  }
  let statusToUpdate = status === "in progress" ? "finished" : "in progress";
  return (
    visible && (
      <div className="flex flex-col gap-2">
        <Button
          className={cn(
            "w-[140px] bg-green-600 hover:bg-green-500",
            status === "in progress" && "bg-blue-600 hover:bg-blue-500"
          )}
          variant="default"
          onClick={() => updateService(queueEntryId, statusToUpdate)}
          disabled={disabled}
        >
          {buttonText}
        </Button>
        {disabled && !isLoading && barberIsOnBreak && (
          <p className="text-xs text-slate-800">Barber is on break</p>
        )}
        {disabled && !isLoading && barberIsBusy && (
          <p className="text-xs text-slate-800">Barber is busy</p>
        )}
        {disabled && !isLoading && !selectedBarberId && (
          <p className="text-xs text-slate-800">Assign a barber to start</p>
        )}
        {isSuccess === false && (
          <p className="text-xs text-red-500">{message}</p>
        )}
      </div>
    )
  );
}
