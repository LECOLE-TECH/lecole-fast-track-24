import type { User } from "~/types/user";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const login = async (user: Omit<User, "user_id" | "roles" | "ord">) => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    if (data.data && data.data.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    return data;
  } catch (error) {
    console.error("Login user: ", error);
    throw error;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setAuthHeader = (headers: Headers) => {
  const token = getAccessToken();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
};
