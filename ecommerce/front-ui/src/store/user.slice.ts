import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  token: string | null
  user: { id: string; name: string; email: string; role: string } | null
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string; user: UserState['user'] }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.token!)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
