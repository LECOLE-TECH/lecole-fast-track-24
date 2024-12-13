import type { Todo } from "~/types/todos";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/todos`;

export const getUsers = async (
  page: number = 1,
  take: number = 10
): Promise<Todo> => {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const createTodo = async (
  todo: Omit<Todo, "id" | "createdAt">
): Promise<Todo> => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating todo: ", error);
    throw error;
  }
};

export const updateTodo = async (
  id: number,
  todo: Partial<Omit<Todo, "id" | "createdAt" | "title">>
): Promise<Todo> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating todo: ", error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting todo: ", error);
    throw error;
  }
};

export const syncTodos = async (todos: any): Promise<Todo[]> => {
  try {
    const response = await fetch(`${baseUrl}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todos),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error sync todos: ", error);
    throw error;
  }
};
