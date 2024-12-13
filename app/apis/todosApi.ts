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

// export const getUserByUsername = async (username: string): Promise<User> => {
//   try {
//     const response = await fetch(`${baseUrl}/${username}`);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };

// export const getUserRevealPass = async (id: string): Promise<User> => {
//   try {
//     const response = await fetch(`${baseUrl}/reveal-pass/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };

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
