import { NextResponse } from "next/server"

// Mock database - in a real app, this would be MongoDB
// This is a reference to the same array in the main route file
// In a real app, this would be a database query
let bundles = [
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
    image: "/placeholder.svg?height=300&width=300",
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
    image: "/placeholder.svg?height=300&width=300",
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
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Helper function to calculate bundle discount
function calculateBundlePrice(products) {
  const originalPrice = products.reduce((sum, product) => {
    // Use sale price if available, otherwise use regular price
    const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
    return sum + productPrice
  }, 0)

  const discountedPrice = originalPrice * 0.9 // 10% discount

  return {
    originalPrice,
    discountedPrice,
  }
}

// GET /api/bundles/[id] - Get a specific bundle
export async function GET(request, { params }) {
  try {
    const id = params.id
    const bundle = bundles.find((b) => b.id === id)

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }

    return NextResponse.json(bundle)
  } catch (error) {
    console.error("Error fetching bundle:", error)
    return NextResponse.json({ error: "Failed to fetch bundle", message: error.message }, { status: 500 })
  }
}

// PATCH /api/bundles/[id] - Update a bundle
export async function PATCH(request, { params }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find bundle index
    const bundleIndex = bundles.findIndex((b) => b.id === id)

    if (bundleIndex === -1) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }

    // Validate products if provided
    if (data.products && data.products.length < 2) {
      return NextResponse.json({ error: "Bundle must have at least 2 products" }, { status: 400 })
    }

    // Calculate prices if products are updated
    let priceUpdates = {}
    if (data.products) {
      priceUpdates = calculateBundlePrice(data.products)
    }

    // Update bundle
    const updatedBundle = {
      ...bundles[bundleIndex],
      ...data,
      ...priceUpdates,
      updatedAt: new Date().toISOString(),
    }

    bundles[bundleIndex] = updatedBundle

    return NextResponse.json(updatedBundle)
  } catch (error) {
    console.error("Error updating bundle:", error)
    return NextResponse.json({ error: "Failed to update bundle", message: error.message }, { status: 500 })
  }
}

// DELETE /api/bundles/[id] - Delete a bundle
export async function DELETE(request, { params }) {
  try {
    const id = params.id

    // Find bundle index
    const bundleIndex = bundles.findIndex((b) => b.id === id)

    if (bundleIndex === -1) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }

    // Remove from "database"
    bundles = bundles.filter((b) => b.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bundle:", error)
    return NextResponse.json({ error: "Failed to delete bundle", message: error.message }, { status: 500 })
  }
}
