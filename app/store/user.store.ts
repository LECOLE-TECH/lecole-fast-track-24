import { StateCreator } from "zustand"
import { User } from "~/types/users.types"

export interface UserSlice {
  token: string | null
  user: User | null

  setToken: (token: string) => void
  setUser: (user: User) => void
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  token: null,
  user: null,
  setToken: (token: string) => set({ token }),
  setUser: (user: User) => set({ user })
})
