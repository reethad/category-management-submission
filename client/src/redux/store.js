import { configureStore } from "@reduxjs/toolkit"
import bundlesReducer from "./slices/bundlesSlice"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    bundles: bundlesReducer,
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export default store
