import { create } from "zustand"
import { createUserSlice, UserSlice } from "./user.store"

export const useStore = create<UserSlice>()((...a) => ({
  ...createUserSlice(...a)
}))
