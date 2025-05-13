import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Store registered users in memory (in a real app, this would be in a database)
const registeredUsers = [
  {
    id: "u1",
    email: "user@example.com",
    password: "password",
    name: "John Doe",
    role: "customer",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
  },
  {
    id: "s1",
    email: "seller@example.com",
    password: "password",
    name: "Jane Smith",
    role: "seller",
    avatar: "/placeholder.svg?height=100&width=100&text=JS",
  },
]

const initialState = {
  user: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
}

// Register a new user
export const register = createAsyncThunk("auth/register", async ({ name, email, password }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (registeredUsers.find((user) => user.email === email)) {
    throw new Error("Email already registered")
  }

  // Create new user
  const newUser = {
    id: `u${Date.now()}`,
    email,
    password,
    name,
    role: "customer",
    avatar: `/placeholder.svg?height=100&width=100&text=${name.charAt(0)}${name.split(" ")[1]?.charAt(0) || ""}`,
  }

  // Add to registered users
  registeredUsers.push(newUser)

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
})

// Login function
export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user
  const user = registeredUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
})

export const updateProfile = createAsyncThunk("auth/updateProfile", async ({ name, avatar }, { getState }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const state = getState().auth
  if (!state.user) {
    throw new Error("User not authenticated")
  }

  // Update user in registered users
  const userIndex = registeredUsers.findIndex((u) => u.id === state.user.id)
  if (userIndex !== -1) {
    registeredUsers[userIndex] = {
      ...registeredUsers[userIndex],
      name,
      avatar,
    }
  }

  return {
    ...state.user,
    name,
    avatar,
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
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
        state.error = action.error.message || "Registration failed"
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
        state.error = action.error.message || "Login failed"
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
        state.error = action.error.message || "Failed to update profile"
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.status = "loading"
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle"
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
