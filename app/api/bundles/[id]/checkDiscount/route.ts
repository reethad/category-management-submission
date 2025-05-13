import { NextResponse } from "next/server"

// Mock database - in a real app, this would be MongoDB
const bundles = [
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

// GET /api/bundles/[id]/checkDiscount - Validate bundle discount
export async function GET(request, { params }) {
  try {
    const id = params.id

    // Find the bundle in our mock database
    const bundle = bundles.find((b) => b.id === id)

    // If bundle doesn't exist, return a 404 error
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
    }

    // Calculate the discount
    const originalPrice = bundle.products.reduce((sum, product) => {
      // Use sale price if available, otherwise use regular price
      const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
      return sum + productPrice
    }, 0)

    const discountedPrice = originalPrice * 0.9 // 10% discount
    const savings = originalPrice - discountedPrice

    return NextResponse.json({
      bundleId: id,
      originalPrice,
      discountedPrice,
      savings,
      discountPercentage: 10,
      products: bundle.products,
      name: bundle.name,
      description: bundle.description,
    })
  } catch (error) {
    console.error("Error checking discount:", error)

    // Return a proper error response
    return NextResponse.json({ error: "Failed to check discount", message: error.message }, { status: 500 })
  }
}
