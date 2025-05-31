"use client";
import { Barber } from "@/types/db";
import { Button } from "../ui/button";
import { toggleStaffStatus } from "@/utils/supabase/actions";
import { cn } from "@/utils/utils";
export default function AdminStaffContainer({ staff }: { staff: Barber }) {
  async function handleClick() {
    await toggleStaffStatus(staff.id, staff.status);
  }
  return (
    <div className="flex items-center gap-10">
      <p className="max-w-1/4 w-60 font-semibold">
        {staff.first_name} {staff.last_name}
      </p>
      <p
        className={cn(
          "w-20 text-center px-2 rounded-md",
          staff.status === "onsite" ? "bg-green-500" : "bg-red-500"
        )}
      >
        {staff.status}
      </p>
      <Button
        variant="link"
        className="w-35 justify-self-start text-blue-600"
        onClick={handleClick}
      >
        {staff.status === "onsite" ? "Check out" : "Check in"}
      </Button>
    </div>
  );
}
