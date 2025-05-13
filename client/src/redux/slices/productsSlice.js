import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

const initialState = {
  items: [],
  pagination: null,
  status: "idle",
  error: null,
}

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products?page=${page}&limit=${limit}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Failed to fetch products")
    }
  },
)

// Fetch a single product
export const fetchProduct = createAsyncThunk("products/fetchProduct", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to fetch product")
  }
})

// Add a new product
export const addProduct = createAsyncThunk("products/addProduct", async (product, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/products", product)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to create product")
  }
})

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, product)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Failed to update product")
    }
  },
)

// Delete a product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to delete product")
  }
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.items.findIndex((product) => product._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((product) => product._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })

      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product._id !== action.payload)
      })
  },
})

export default productsSlice.reducer
