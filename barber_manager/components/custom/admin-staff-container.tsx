import { Barber } from "@/types/db";
import { Button } from "../ui/button";
export default function AdminStaffContainer({ staff }: { staff: Barber }) {
  return (
    <div className="flex items-center gap-10">
      <p className="w-1/4 font-semibold">
        {staff.first_name} {staff.last_name}
      </p>
      <p className="w-20 text-center">{staff.status}</p>
      <Button variant="default" className="w-35 justify-self-start">{staff.status === "onsite" ? "Check out" : "Check in"}</Button>
    </div>
  );
}
