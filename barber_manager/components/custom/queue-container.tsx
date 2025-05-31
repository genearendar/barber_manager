"use client";
import { QueueEntry, Barber } from "@/types/db";
import { cn, calculateWaitTime } from "@/utils/utils";
import useQueueRealtime from "@/hooks/use-queue-realtime";
import { Clock, Scissors } from "lucide-react";
export default function QueueContainer({
  queueData,
  staffData,
}: {
  queueData: QueueEntry[] | null;
  staffData: Barber[] | null;
}) {
  const { realtimeQueue, realtimeStaff } = useQueueRealtime(
    queueData,
    staffData
  );
  // Implement an extra filter to only retain waiting entries
  const filteredQueue = realtimeQueue?.filter(
    (entry) => entry.status === "waiting"
  );
  const queueElements = filteredQueue?.map((entry, index) => {
    return (
      <div
        key={entry.id}
        className="flex flex-col gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-200"
      >
        <div className="flex justify-between">
          <div className="w-fit bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full">
            #{index + 1}
          </div>
          <span className="text-2xl">✂️</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900">{entry.name}</h3>
        {/* <p>{entry.status}</p> */}
        <div className="flex justify-between">
          <div className="flex">
            <Clock />
            <p className="text-md ml-2">Est. wait:</p>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {calculateWaitTime(realtimeStaff, index)}
          </div>
        </div>
      </div>
    );
  });
  return <div className="flex flex-col gap-2 max-w-2xl">{queueElements}</div>;
}
