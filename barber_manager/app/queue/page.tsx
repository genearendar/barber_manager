import { getActiveQueue, getAllCurrentStaff } from "@/utils/supabase/queries";
import QueueContainer from "@/components/custom/queue-container";
import { Scissors } from "lucide-react";
export default async function QueuePage() {
  const queueData = await getActiveQueue();
  const staffData = await getAllCurrentStaff();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center mb-12">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Live Queue</h1>
            <p className="text-gray-600">Updated in real-time</p>
          </div>
        </div>
        <QueueContainer queueData={queueData} staffData={staffData} />
      </div>
    </div>
  );
}
