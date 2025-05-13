import { createSlice } from "@reduxjs/toolkit"

const cartItemsFromStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []

const initialState = {
  items: cartItemsFromStorage,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { type, item, quantity } = action.payload
      const existingIndex = state.items.findIndex(
        (cartItem) => cartItem.type === type && cartItem.item._id === item._id,
      )

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity
      } else {
        state.items.push({
          type,
          item,
          quantity,
        })
      }

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      const { type, id } = action.payload
      state.items = state.items.filter((item) => !(item.type === type && item.item._id === id))

      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { type, id, quantity } = action.payload
      const existingIndex = state.items.findIndex((item) => item.type === type && item.item._id === id)

      if (existingIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(existingIndex, 1)
        } else {
          state.items[existingIndex].quantity = quantity
        }

        // Save to localStorage
        localStorage.setItem("cartItems", JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []

      // Save to localStorage
      localStorage.removeItem("cartItems")
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
