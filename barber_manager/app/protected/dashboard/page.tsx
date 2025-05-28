import { getAllQueue, getStaff } from "@/utils/supabase/queries";
import DashQueueContainer from "@/components/custom/dash-queue-container";

export default async function DashboardPage() {
  const queueData = await getAllQueue();
  const staffData = await getStaff();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1>Barbers dashboard here</h1>
        <DashQueueContainer queueData={queueData} />
      </div>
    </div>
  );
}
