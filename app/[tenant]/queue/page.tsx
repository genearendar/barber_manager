import { getAllQueue, getAllCurrentStaff } from "@/utils/supabase/queries";
import QueueContainer from "@/components/custom/queue-container";

export default async function QueuePage() {
  const queueData = await getAllQueue();
  const staffData = await getAllCurrentStaff();
  return (
    <div className="w-full max-w-7xl flex flex-col gap-12">
      <QueueContainer queueData={queueData} staffData={staffData} />
    </div>
  );
}
