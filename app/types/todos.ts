export interface Todo {
  id: number;
  title: string;
  status: "backlog" | "in_progress" | "done";
  createdAt: string;
}

export interface TodoLocal {
  id: number;
  title: string;
  status: "backlog" | "in_progress" | "done";
  synced: boolean;
  created_at: string;
}