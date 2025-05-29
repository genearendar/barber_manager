import { getAllQueue, getStaff } from "@/utils/supabase/queries";
import DashQueueTable from "@/components/custom/dash-queue-table";

export default async function DashboardPage() {
  const queueData = await getAllQueue();
  const staffData = await getStaff();
  return (
    <div className="flex flex-col gap-12">
      <div className="w-full">
        <h1>Barbers dashboard here</h1>
        <DashQueueTable queueData={queueData} staffData={staffData} />
      </div>
    </div>
  );
}
