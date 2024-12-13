import type { BackendTodo } from "./types";

const API_BASE_URL = "http://localhost:3000/api/todos";


export const fetchTodos = async (): Promise<BackendTodo[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch todos.");
    }
    return await response.json();
};


export const createTodo = async (
  title: string,
  status: "backlog" | "in_progress" | "done" = "backlog"
): Promise<BackendTodo> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, status }),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo.");
    }

    return await response.json();
};


export const updateTodoStatus = async (
  id: number,
  status: "backlog" | "in_progress" | "done"
): Promise<{ id: number; status: string }> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo status.");
    }

    return await response.json();
};


export const deleteTodo = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo.");
    }
};


export const syncTodos = async (todos: Partial<BackendTodo>[]): Promise<BackendTodo[]> => {
    const response = await fetch(`${API_BASE_URL}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todos }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync todos.");
    }

    return await response.json();
};
