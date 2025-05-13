import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { type, item, quantity } = action.payload
      const existingIndex = state.items.findIndex((cartItem) => cartItem.type === type && cartItem.item.id === item.id)

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity
      } else {
        state.items.push({
          type,
          item,
          quantity,
        })
      }
    },
    removeFromCart: (state, action) => {
      const { type, id } = action.payload
      state.items = state.items.filter((item) => !(item.type === type && item.item.id === id))
    },
    updateQuantity: (state, action) => {
      const { type, id, quantity } = action.payload
      const existingIndex = state.items.findIndex((item) => item.type === type && item.item.id === id)

      if (existingIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(existingIndex, 1)
        } else {
          state.items[existingIndex].quantity = quantity
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
