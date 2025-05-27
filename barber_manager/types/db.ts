export type QueueEntry = {
  id: number; // Assuming 'int8' maps to number in TS
  created_at: string; // Supabase timestamptz comes as string (ISO 8601)
  name: string;
  status: "waiting" | "in_progress" | "finished" | "cancelled"; // Use your ENUM type
  started_at: string | null;
  finished_at: string | null;
  barber_name: string | null;
  // client_id: string | null;
};
