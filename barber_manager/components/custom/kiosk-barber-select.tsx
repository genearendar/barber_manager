"use client";
import { Barber } from "@/types/db";
import UseQueueRealtime from "@/hooks/use-queue-realtime";

export default function KioskBarberSelect({
  initialStaff,
}: {
  initialStaff: Barber[] | null;
}) {
  const { realtimeStaff } = UseQueueRealtime(null, initialStaff);
  const availableStaff = realtimeStaff?.filter(
    (staff: Barber) => staff.status === "onsite" || staff.status === "break"
  );
  const staffSelectItems = availableStaff?.map((staff: Barber) => (
    <option key={staff.id} value={staff.id}>
      {staff.first_name}
    </option>
  ));
  return (
    <div className="mb-4">
      <label
        htmlFor="barber-select"
        className="block text-sm font-medium text-gray-700"
      >
        Do you have a preferred barber?
      </label>
      <select
        id="barber-select"
        name="barberSelection"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        aria-describedby="barber-select-description"
      >
        <option value="">-- Any available barber --</option>
        {staffSelectItems}
      </select>
      <p id="barber-select-description" className="mt-2 text-xs text-gray-500">
        Selecting a preferred barber may increase your wait time.
      </p>
    </div>
  );
}
