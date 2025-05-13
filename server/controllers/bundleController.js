const Bundle = require("../models/Bundle")
const asyncHandler = require("../utils/asyncHandler")

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
const getBundles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query

  const query = {}
  if (status) {
    query.status = status
  }

  const bundles = await Bundle.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()

  const count = await Bundle.countDocuments(query)

  res.json({
    bundles,
    pagination: {
      total: count,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  })
})

// @desc    Get bundle by ID
// @route   GET /api/bundles/:id
// @access  Public
const getBundleById = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)

  if (!bundle) {
    res.status(404)
    throw new Error("Bundle not found")
  }

  res.json(bundle)
})

// @desc    Create a bundle
// @route   POST /api/bundles
// @access  Private/Seller
const createBundle = asyncHandler(async (req, res) => {
  const { name, description, products, status } = req.body

  // Validate required fields
  if (!name || !products || products.length < 2) {
    res.status(400)
    throw new Error("Bundle must have a name and at least 2 products")
  }

  // Calculate prices
  const originalPrice = products.reduce((sum, product) => {
    const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
    return sum + productPrice
  }, 0)

  const discountedPrice = Number.parseFloat((originalPrice * 0.9).toFixed(2)) // 10% discount

  // Create new bundle
  const bundle = new Bundle({
    name,
    description: description || "",
    products,
    originalPrice,
    discountedPrice,
    status: status || "draft",
    sellerId: req.user._id,
    image: `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}`,
  })

  const savedBundle = await bundle.save()

  res.status(201).json(savedBundle)
})

// @desc    Update a bundle
// @route   PATCH /api/bundles/:id
// @access  Private/Seller
const updateBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)

  if (!bundle) {
    res.status(404)
    throw new Error("Bundle not found")
  }

  // Check if user is the seller of this bundle
  if (bundle.sellerId.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to update this bundle")
  }

  // Validate products if provided
  if (req.body.products && req.body.products.length < 2) {
    res.status(400)
    throw new Error("Bundle must have at least 2 products")
  }

  // Calculate prices if products are updated
  let priceUpdates = {}
  if (req.body.products) {
    const originalPrice = req.body.products.reduce((sum, product) => {
      const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
      return sum + productPrice
    }, 0)

    priceUpdates = {
      originalPrice,
      discountedPrice: Number.parseFloat((originalPrice * 0.9).toFixed(2)),
    }
  }

  // Update bundle
  const updatedBundle = await Bundle.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...priceUpdates,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true },
  )

  res.json(updatedBundle)
})

// @desc    Delete a bundle
// @route   DELETE /api/bundles/:id
// @access  Private/Seller
const deleteBundle = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)

  if (!bundle) {
    res.status(404)
    throw new Error("Bundle not found")
  }

  // Check if user is the seller of this bundle
  if (bundle.sellerId.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to delete this bundle")
  }

  await Bundle.findByIdAndDelete(req.params.id)

  res.json({ success: true })
})

// @desc    Check bundle discount
// @route   GET /api/bundles/:id/checkDiscount
// @access  Public
const checkBundleDiscount = asyncHandler(async (req, res) => {
  const bundle = await Bundle.findById(req.params.id)

  if (!bundle) {
    res.status(404)
    throw new Error("Bundle not found")
  }

  // Calculate the discount
  const originalPrice = bundle.originalPrice
  const discountedPrice = bundle.discountedPrice
  const savings = Number.parseFloat((originalPrice - discountedPrice).toFixed(2))

  res.json({
    bundleId: bundle._id,
    name: bundle.name,
    description: bundle.description,
    originalPrice,
    discountedPrice,
    savings,
    discountPercentage: 10,
    products: bundle.products,
  })
})

module.exports = {
  getBundles,
  getBundleById,
  createBundle,
  updateBundle,
  deleteBundle,
  checkBundleDiscount,
}
