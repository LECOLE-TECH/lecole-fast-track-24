export interface Todo {
  id: number;
  title: string;
  status: "backlog" | "in_progress" | "done";
  createdAt: string;
}

export interface TodoLocal {
  id: number;
  title: string;
  status: Todo["status"];
  synced: boolean;
  created_at: string;
}

export interface TodoUpdate {
  id: number;
  status: Todo["status"];
}

export interface NewTodo {
  title: string;
  status: Todo["status"];
}
