const mongoose = require("mongoose")

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Bundle name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  products: [
    {
      id: String,
      name: String,
      price: Number,
      salePrice: Number,
      image: String,
    },
  ],
  originalPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "draft"],
    default: "draft",
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

// Calculate prices before saving
bundleSchema.pre("save", function (next) {
  // Calculate original price
  this.originalPrice = this.products.reduce((sum, product) => {
    const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
    return sum + productPrice
  }, 0)

  // Apply 10% discount
  this.discountedPrice = Number.parseFloat((this.originalPrice * 0.9).toFixed(2))

  // Update the updatedAt field
  this.updatedAt = Date.now()

  next()
})

module.exports = mongoose.model("Bundle", bundleSchema)
