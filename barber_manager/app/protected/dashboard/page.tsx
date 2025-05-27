import { getActiveQueue } from "@/utils/supabase/queries";

export default async function DashboardPage() {
  await getActiveQueue();
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1>Barbers dashboard here</h1>
      </div>
    </div>
  );
}
