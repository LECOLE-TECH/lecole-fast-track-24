export interface Todo {
  id: number;
  title: string;
  status: "backlog" | "in_progress" | "done";
  createdAt: string;
}
