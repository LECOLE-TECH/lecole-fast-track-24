import React, { createContext, useContext, type ReactNode } from "react";
import { useAuthStore, type AuthState } from "~/store/authStore";

interface AuthContextProps {
	user: AuthState["user"];
	login: AuthState["login"];
	logout: AuthState["logout"];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { user, login, logout } = useAuthStore();

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
