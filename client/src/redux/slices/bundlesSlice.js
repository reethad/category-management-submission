import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

const initialState = {
  items: [],
  pagination: null,
  status: "idle",
  error: null,
}

// Fetch all bundles
export const fetchBundles = createAsyncThunk(
  "bundles/fetchBundles",
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      let url = `/bundles?page=${page}&limit=${limit}`
      if (status) {
        url += `&status=${status}`
      }

      const { data } = await api.get(url)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Failed to fetch bundles")
    }
  },
)

// Fetch a single bundle
export const fetchBundle = createAsyncThunk("bundles/fetchBundle", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/bundles/${id}`)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to fetch bundle")
  }
})

// Add a new bundle
export const addBundle = createAsyncThunk("bundles/addBundle", async (bundle, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/bundles", bundle)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to create bundle")
  }
})

// Update a bundle
export const updateBundle = createAsyncThunk("bundles/updateBundle", async ({ id, bundle }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/bundles/${id}`, bundle)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to update bundle")
  }
})

// Delete a bundle
export const deleteBundle = createAsyncThunk("bundles/deleteBundle", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/bundles/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to delete bundle")
  }
})

// Check bundle discount
export const checkBundleDiscount = createAsyncThunk("bundles/checkDiscount", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/bundles/${id}/checkDiscount`)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to check discount")
  }
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
        state.items = action.payload.bundles
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBundles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Fetch single bundle
      .addCase(fetchBundle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBundle.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.items.findIndex((bundle) => bundle._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchBundle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Add bundle
      .addCase(addBundle.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // Update bundle
      .addCase(updateBundle.fulfilled, (state, action) => {
        const index = state.items.findIndex((bundle) => bundle._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })

      // Delete bundle
      .addCase(deleteBundle.fulfilled, (state, action) => {
        state.items = state.items.filter((bundle) => bundle._id !== action.payload)
      })
  },
})

export default bundlesSlice.reducer
