import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  productId: string
  product: {
    _id: string
    name: string
    price: number
    discountedPrice: number
    images: string[]
  }
  qty: number
}

interface CartState {
  items: CartItem[]
}

const stored = localStorage.getItem('cart')
const initialState: CartState = {
  items: stored ? JSON.parse(stored) : [],
}

const save = (items: CartItem[]) => localStorage.setItem('cart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.productId === action.payload.productId)
      if (existing) {
        existing.qty += action.payload.qty
      } else {
        state.items.push(action.payload)
      }
      save(state.items)
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.productId !== action.payload)
      save(state.items)
    },
    updateQty(state, action: PayloadAction<{ productId: string; qty: number }>) {
      const item = state.items.find(i => i.productId === action.payload.productId)
      if (item) item.qty = action.payload.qty
      save(state.items)
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
