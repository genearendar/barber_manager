import { QueueEntry } from "@/types/db";
export default function QueueContainer({
  queueData,
}: {
  queueData: QueueEntry[] | null;
}) {
  console.log(queueData);
  const queueEntries = queueData?.map((person) => {
    return (
      <div key={person.id} className="bg-accent text-sm p-3 px-5 rounded-md">
        <p className="text-xl">{person.name}</p>
        <p className="text-xs text-right">Wait time: 15 minutes</p>
      </div>
    );
  });
  return <div className="flex flex-col gap-2">{queueEntries}</div>;
}
