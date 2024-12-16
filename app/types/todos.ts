export interface Todo {
  id: number;
  title: string;
  status: "backlog" | "in_progress" | "done";
  created_at: string;
}

export interface TodoLocal extends Todo {
  synced: boolean;
  position?: { x: number; y: number };
}

