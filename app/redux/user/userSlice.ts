import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  user: any | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export const userReducer = userSlice.reducer
