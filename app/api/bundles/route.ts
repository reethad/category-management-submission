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

// GET /api/bundles - Get all bundles with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    let filteredBundles = [...bundles]

    // Filter by status if provided
    if (status) {
      filteredBundles = filteredBundles.filter((bundle) => bundle.status === status)
    }

    // Simple pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedBundles = filteredBundles.slice(startIndex, endIndex)

    return NextResponse.json({
      bundles: paginatedBundles,
      pagination: {
        total: filteredBundles.length,
        page,
        limit,
        pages: Math.ceil(filteredBundles.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching bundles:", error)
    return NextResponse.json({ error: "Failed to fetch bundles", message: error.message }, { status: 500 })
  }
}

// POST /api/bundles - Create a new bundle
export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.products || data.products.length < 2) {
      return NextResponse.json({ error: "Bundle must have a name and at least 2 products" }, { status: 400 })
    }

    // Calculate prices if not provided
    let prices = { originalPrice: data.originalPrice, discountedPrice: data.discountedPrice }
    if (!data.originalPrice || !data.discountedPrice) {
      prices = calculateBundlePrice(data.products)
    }

    // Create new bundle
    const newBundle = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || "",
      products: data.products,
      originalPrice: prices.originalPrice,
      discountedPrice: prices.discountedPrice,
      status: data.status || "draft",
      sellerId: data.sellerId || "s1", // In a real app, this would come from auth
      createdAt: new Date().toISOString(),
      image: "/placeholder.svg?height=300&width=300", // Default image
    }

    // Add to "database"
    bundles.push(newBundle)

    return NextResponse.json(newBundle, { status: 201 })
  } catch (error) {
    console.error("Error creating bundle:", error)
    return NextResponse.json({ error: "Failed to create bundle", message: error.message }, { status: 500 })
  }
}
