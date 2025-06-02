"use client";
import { Barber } from "@/types/db";
import { Button } from "../ui/button";
import { toggleStaffStatus } from "@/utils/supabase/actions";
import { cn } from "@/utils/utils";
import UseAsyncAction from "@/hooks/use-async-action";
export default function AdminStaffEtry({ staff }: { staff: Barber }) {
  const {
    execute: toggleStatus,
    isLoading,
    isSuccess,
    message,
  } = UseAsyncAction(toggleStaffStatus);
  return (
    <div className="flex items-center gap-10">
      <p className="max-w-1/4 w-60 font-semibold">
        {staff.first_name} {staff.last_name}
      </p>
      <p
        className={cn(
          "w-20 text-center px-2 rounded-md",
          staff.status === "onsite"
            ? "bg-green-500"
            : staff.status === "break"
              ? "bg-yellow-500"
              : "bg-red-500"
        )}
      >
        {staff.status}
      </p>
      <div>
        <div className="buttons">
          {staff.status !== "break" && (
            <Button
              variant="link"
              className="w-35 justify-self-start text-blue-600"
              disabled={isLoading}
              onClick={() =>
                toggleStatus(
                  staff.id,
                  staff.status !== "onsite" ? "onsite" : "offsite"
                )
              }
              aria-label="Check in and out"
            >
              {staff.status === "onsite" ? "Check out" : "Check in"}
            </Button>
          )}
          {staff.status !== "offsite" && (
            <Button
              variant="link"
              className="w-35 justify-self-start text-blue-600"
              disabled={isLoading}
              onClick={() =>
                toggleStatus(
                  staff.id,
                  staff.status === "onsite" ? "break" : "onsite"
                )
              }
              aria-label="Start and finish break"
            >
              {staff.status === "onsite" ? "Take a break" : "Finish break"}
            </Button>
          )}
        </div>
        {message && (
          <p
            className={cn(
              "text-xs text-green-500 px-4",
              !isSuccess && "text-red-500"
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
