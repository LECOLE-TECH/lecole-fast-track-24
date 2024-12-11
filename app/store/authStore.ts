import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface User {
	id: number;
	username: string;
	roles: string;
	secret_phrase: string;
}

export interface AuthState {
	token: string | null;
	user: User | null;
	isHydrated: boolean;
	login: (token: string) => void;
	logout: () => void;
	setHydrated: () => void;
}

interface DecodedToken {
	id: number;
	username: string;
	roles: string;
	secret_phrase: string;
	iat: number;
	exp: number;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			isHydrated: false,
			login: (token: string) => {
				const decoded: DecodedToken = jwtDecode(token);
				set({
					token,
					user: {
						id: decoded.id,
						username: decoded.username,
						roles: decoded.roles,
						secret_phrase: decoded.secret_phrase,
					},
				});
			},
			logout: () => set({ token: null, user: null }),
			setHydrated: () => set({ isHydrated: true }),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated();
			},
		},
	),
);
