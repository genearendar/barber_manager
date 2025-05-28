import { QueueEntry } from "@/types/db";
import { cn } from "@/lib/utils";
export default function DashQueueContainer({
  queueData,
}: {
  queueData: QueueEntry[] | null;
}) {
  const queueEntries = queueData?.map((person) => {
    return (
      <div
        key={person.id}
        className={cn("text-sm p-3 px-5 rounded-md", {
          "bg-yellow-500": person.status === "waiting",
          "bg-green-500": person.status === "in progress",
          "bg-blue-500": person.status === "finished",
          "bg-red-500": person.status === "cancelled",
        })}
      >
        <p className="text-xl">{person.name}</p>
        <p className="text-xs text-right">{person.status}</p>
      </div>
    );
  });
  return <div className="flex flex-col gap-2">{queueEntries}</div>;
}
