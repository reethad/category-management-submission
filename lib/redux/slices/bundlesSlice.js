import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Initial bundles data
const initialBundles = [
  {
    id: "1",
    name: "Summer Essentials",
    description: "Everything you need for summer",
    products: [
      { id: "p1", name: "Sunglasses", price: 29.99 },
      { id: "p2", name: "Beach Towel", price: 19.99 },
      { id: "p3", name: "Sunscreen", price: 12.99 },
    ],
    originalPrice: 62.97,
    discountedPrice: 56.67,
    status: "active",
    sellerId: "s1",
    createdAt: new Date().toISOString(),
    image: "/placeholder.svg?height=300&width=300&text=Summer+Essentials",
  },
  {
    id: "2",
    name: "Home Office Setup",
    description: "Essentials for your home office",
    products: [
      { id: "p4", name: "Desk Lamp", price: 39.99 },
      { id: "p5", name: "Wireless Mouse", price: 24.99 },
      { id: "p6", name: "Keyboard", price: 49.99 },
    ],
    originalPrice: 114.97,
    discountedPrice: 103.47,
    status: "active",
    sellerId: "s1",
    createdAt: new Date().toISOString(),
    image: "/placeholder.svg?height=300&width=300&text=Home+Office",
  },
  {
    id: "3",
    name: "Fitness Pack",
    description: "Start your fitness journey",
    products: [
      { id: "p7", name: "Yoga Mat", price: 29.99 },
      { id: "p8", name: "Water Bottle", price: 14.99 },
      { id: "p9", name: "Resistance Bands", price: 19.99 },
    ],
    originalPrice: 64.97,
    discountedPrice: 58.47,
    status: "draft",
    sellerId: "s1",
    createdAt: new Date().toISOString(),
    image: "/placeholder.svg?height=300&width=300&text=Fitness+Pack",
  },
]

const initialState = {
  items: [],
  status: "idle",
  error: null,
}

// Modified to use local data instead of API call to avoid JSON parsing errors
export const fetchBundles = createAsyncThunk("bundles/fetchBundles", async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return the local data instead of making an API call
  return initialBundles
})

export const addBundle = createAsyncThunk("bundles/addBundle", async (bundle) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newBundle = {
    ...bundle,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  return newBundle
})

export const updateBundle = createAsyncThunk("bundles/updateBundle", async ({ id, bundle }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    ...bundle,
    id,
    updatedAt: new Date().toISOString(),
  }
})

export const deleteBundle = createAsyncThunk("bundles/deleteBundle", async (id) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return id
})

const bundlesSlice = createSlice({
  name: "bundles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bundles
      .addCase(fetchBundles.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBundles.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchBundles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch bundles"
      })

      // Add bundle
      .addCase(addBundle.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // Update bundle
      .addCase(updateBundle.fulfilled, (state, action) => {
        const index = state.items.findIndex((bundle) => bundle.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })

      // Delete bundle
      .addCase(deleteBundle.fulfilled, (state, action) => {
        state.items = state.items.filter((bundle) => bundle.id !== action.payload)
      })
  },
})

export default bundlesSlice.reducer
