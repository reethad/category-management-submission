import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  items: [
    {
      id: "p1",
      name: "Sunglasses",
      price: 29.99,
      description: "Stylish sunglasses with UV protection",
      image: "/placeholder.svg?height=300&width=300&text=Sunglasses",
    },
    {
      id: "p2",
      name: "Beach Towel",
      price: 19.99,
      description: "Soft and absorbent beach towel",
      image: "/placeholder.svg?height=300&width=300&text=Beach+Towel",
    },
    {
      id: "p3",
      name: "Sunscreen",
      price: 12.99,
      description: "SPF 50 sunscreen for maximum protection",
      image: "/placeholder.svg?height=300&width=300&text=Sunscreen",
    },
    {
      id: "p4",
      name: "Desk Lamp",
      price: 39.99,
      description: "Adjustable desk lamp with multiple brightness levels",
      image: "/placeholder.svg?height=300&width=300&text=Desk+Lamp",
    },
    {
      id: "p5",
      name: "Wireless Mouse",
      price: 24.99,
      salePrice: 19.99,
      description: "Ergonomic wireless mouse with long battery life",
      image: "/placeholder.svg?height=300&width=300&text=Wireless+Mouse",
    },
    {
      id: "p6",
      name: "Keyboard",
      price: 49.99,
      description: "Mechanical keyboard with RGB lighting",
      image: "/placeholder.svg?height=300&width=300&text=Keyboard",
    },
    {
      id: "p7",
      name: "Yoga Mat",
      price: 29.99,
      description: "Non-slip yoga mat for all types of yoga",
      image: "/placeholder.svg?height=300&width=300&text=Yoga+Mat",
    },
    {
      id: "p8",
      name: "Water Bottle",
      price: 14.99,
      description: "Insulated water bottle that keeps drinks cold for hours",
      image: "/placeholder.svg?height=300&width=300&text=Water+Bottle",
    },
    {
      id: "p9",
      name: "Resistance Bands",
      price: 19.99,
      salePrice: 15.99,
      description: "Set of resistance bands for home workouts",
      image: "/placeholder.svg?height=300&width=300&text=Resistance+Bands",
    },
    {
      id: "p10",
      name: "Headphones",
      price: 79.99,
      description: "Noise-cancelling headphones with premium sound quality",
      image: "/placeholder.svg?height=300&width=300&text=Headphones",
    },
    {
      id: "p11",
      name: "Smartphone Case",
      price: 15.99,
      description: "Durable smartphone case with drop protection",
      image: "/placeholder.svg?height=300&width=300&text=Smartphone+Case",
    },
    {
      id: "p12",
      name: "Portable Charger",
      price: 34.99,
      salePrice: 29.99,
      description: "High-capacity portable charger for all your devices",
      image: "/placeholder.svg?height=300&width=300&text=Portable+Charger",
    },
  ],
  status: "succeeded",
  error: null,
}

// In a real app, we would fetch products from an API
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return initialState.items
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
  },
})

export default productsSlice.reducer
