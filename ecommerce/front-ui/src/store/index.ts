import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user.slice'
import cartReducer from './cart.slice'

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
