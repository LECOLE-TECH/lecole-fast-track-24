import type { User } from "~/types/user";
import { decodeToken } from "~/utils/jwtDecode";

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

    if (!data.data) {
      return null;
    } else if (data.data && data.data.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
      const decodedToken = decodeToken(data.data.accessToken);
      return {
        user_id: decodedToken.id,
        username: decodedToken.username,
        roles: decodedToken.roles,
      };
    }
  } catch (error) {
    console.error("Login user: ", error);
    return null;
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

export const logout = async () => {
  try {
    const response = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    localStorage.removeItem("accessToken");

    return data;
  } catch (error) {
    console.error("Logout user: ", error);
    throw error;
  }
};
