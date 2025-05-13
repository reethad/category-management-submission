const Product = require("../models/Product")
const asyncHandler = require("../utils/asyncHandler")

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query

  const products = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()

  const count = await Product.countDocuments()

  res.json({
    products,
    pagination: {
      total: count,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  })
})

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  res.json(product)
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, salePrice, description, image } = req.body

  // Validate required fields
  if (!name || !price) {
    res.status(400)
    throw new Error("Product must have a name and price")
  }

  // Create new product
  const product = new Product({
    name,
    price,
    salePrice,
    description: description || "",
    image: image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}`,
    sellerId: req.user._id,
  })

  const savedProduct = await product.save()

  res.status(201).json(savedProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // Check if user is the seller of this product
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to update this product")
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true },
  )

  res.json(updatedProduct)
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // Check if user is the seller of this product
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to delete this product")
  }

  await Product.findByIdAndDelete(req.params.id)

  res.json({ success: true })
})

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
