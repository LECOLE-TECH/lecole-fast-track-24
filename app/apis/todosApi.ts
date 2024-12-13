import type { To } from "react-router";
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
    console.error("Error creating product: ", error);
    throw error;
  }
};

// export const updateSecretPhrase = async (
//   id: string,
//   newValueSecret: object
// ): Promise<User> => {
//   try {
//     const response = await fetch(`${baseUrl}/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//       body: JSON.stringify(newValueSecret),
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error updating secret phrase: ", error);
//     throw error;
//   }
// };
