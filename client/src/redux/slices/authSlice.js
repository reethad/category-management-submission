import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { setAuthToken, removeAuthToken } from "../../utils/authToken"

// Get user from localStorage
const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

// Set token in axios headers if user exists
if (userFromStorage?.token) {
  setAuthToken(userFromStorage.token)
}

const initialState = {
  user: userFromStorage,
  status: "idle",
  error: null,
  isAuthenticated: !!userFromStorage,
}

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Registration failed")
    }
  },
)

// Login user
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password })

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(data))

    // Set token in axios headers
    setAuthToken(data.token)

    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Login failed")
  }
})

// Update profile
export const updateProfile = createAsyncThunk("auth/updateProfile", async ({ name, avatar }, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/auth/profile", { name, avatar })

    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(data))

    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || "Failed to update profile")
  }
})

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user")
  removeAuthToken()
  return true
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded"
        // Don't log in automatically after registration
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        state.isAuthenticated = false
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle"
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export default authSlice.reducer
