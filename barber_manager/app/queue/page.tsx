import { getActiveQueue, getAvailableStaff } from "@/utils/supabase/queries";
import QueueContainer from "@/components/custom/queue-container";
export default async function QueuePage() {
  const queueData = await getActiveQueue();
  const staffData = await getAvailableStaff();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1>Live queue is publically displayed here</h1>
        <QueueContainer queueData={queueData} staffData={staffData}/>
      </div>
    </div>
  );
}
