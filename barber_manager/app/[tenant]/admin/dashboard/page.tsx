import { getAllQueue, getAllCurrentStaff } from "@/utils/supabase/queries";
import DashQueueTable from "@/components/custom/dash-queue-table";

export default async function DashboardPage() {
  const queueData = await getAllQueue();
  const staffData = await getAllCurrentStaff();
  return (
    <div className="w-full max-w-7xl flex flex-col gap-12">
      <h1 className="text-3xl text-center">Barbers dashboard</h1>
      <DashQueueTable queueData={queueData} staffData={staffData} />
    </div>
  );
}
