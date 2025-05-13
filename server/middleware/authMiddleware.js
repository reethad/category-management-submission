const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

// Protect routes - verify token
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization?.startsWith("Bearer")) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        res.status(401)
        throw new Error("User not found")
      }

      next()
    } catch (error) {
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})

// Check if user is a seller
const seller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next()
  } else {
    res.status(403)
    throw new Error("Not authorized as a seller")
  }
}

// Check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403)
    throw new Error("Not authorized as an admin")
  }
}

module.exports = { protect, seller, admin }
