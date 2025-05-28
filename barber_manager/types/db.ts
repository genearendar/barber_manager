export type QueueEntry = {
  id: number;
  created_at: string;
  name: string;
  status: "waiting" | "in progress" | "finished" | "cancelled";
  started_at: string | null;
  finished_at: string | null;
  barber_name: string | null;
  // client_id: string | null;
};

export type Barber = {
  id: number;
  first_name: string;
  last_name: string;
  status: string;
};
