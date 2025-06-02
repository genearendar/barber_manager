"use client";
import { QueueEntry, Barber } from "@/types/db";
import { cn, calculateWaitTime } from "@/utils/utils";
import useQueueRealtime from "@/hooks/use-queue-realtime";
import { Clock, Scissors } from "lucide-react";
import QueueTimer from "./queue-timer";
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
  // Implement filter to only retain waiting entries
  const filteredQueue = realtimeQueue?.filter(
    (entry) => entry.status === "waiting"
  );
  const queueElements = filteredQueue?.map((entry, index) => {
    return (
      <div
        key={entry.id}
        className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-fit bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
              #{index + 1}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{entry.name}</h3>
          </div>

          <span className="text-2xl">✂️</span>
        </div>

        {/* <p>{entry.status}</p> */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-800" />
            <p className="text-md ml-2">Est. wait</p>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {calculateWaitTime(realtimeStaff, index)}
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <div className="flex justify-between mb-12 w-full max-w-xl">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Live Queue</h1>
            <p className="text-gray-600">Updated in real-time</p>
          </div>
        </div>

        <QueueTimer />
      </div>
      <div className="w-full grid md:grid-cols-2 gap-4">{queueElements}</div>
    </div>
  );
}
