import type { PaginationResponse } from "~/types/paginationResponse";
import type { User } from "~/types/user";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/user`;

export const getUsers = async (
  page: number = 1,
  take: number = 10
): Promise<PaginationResponse<User>> => {
  try {
    const response = await fetch(`${baseUrl}?page=${page}&take=${take}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getUserByUsername = async (username: string): Promise<User> => {
  try {
    const response = await fetch(`${baseUrl}/${username}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
