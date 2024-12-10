import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types/index";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored session
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (err) {
        setError("Failed to check authentication status");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (user: User) => {
    try {
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      setError("Login failed");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      setError("Logout failed");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
