const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  // Check if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
    avatar: `/placeholder.svg?height=100&width=100&text=${name.charAt(0)}${name.split(" ")[1]?.charAt(0) || ""}`,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: user.generateAuthToken(),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    res.status(401)
    throw new Error("Invalid email or password")
  }

  // Check password
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    res.status(401)
    throw new Error("Invalid email or password")
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: user.generateAuthToken(),
  })
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.avatar = req.body.avatar || user.avatar

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      token: updatedUser.generateAuthToken(),
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
}
