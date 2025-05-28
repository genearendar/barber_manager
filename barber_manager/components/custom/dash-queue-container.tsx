import { QueueEntry, Barber } from "@/types/db";
import DashQueueItem from "./dash-queue-item";
export default function DashQueueContainer({
  queueData, staffData
}: {
  queueData: QueueEntry[] | null;
  staffData: Barber[] | null;
}) {
  const queueEntries = queueData?.map((person) => {
    return (
      <DashQueueItem person={person} staffData={staffData} key={person.id} />
    );
  });
  return <div className="flex flex-col gap-2">{queueEntries}</div>;
}
