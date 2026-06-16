import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  token: string | null
  user: { id: string; name: string; email: string; role: string } | null
}

const initialState: UserState = {
  token: localStorage.getItem('cms_token'),
  user: JSON.parse(localStorage.getItem('cms_user') || 'null'),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string; user: UserState['user'] }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('cms_token', action.payload.token!)
      localStorage.setItem('cms_user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('cms_token')
      localStorage.removeItem('cms_user')
    },
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
