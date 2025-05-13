import { GET, POST } from "@/app/api/bundles/route"
import { NextResponse } from "next/server"
import { jest } from "@jest/globals"

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options })),
  },
}))

describe("Bundles API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/bundles", () => {
    it("returns all bundles with default pagination", async () => {
      // Create a mock request
      const request = {
        url: "http://localhost:3000/api/bundles",
      }

      const response = await GET(request)

      expect(NextResponse.json).toHaveBeenCalled()
      expect(response.data.bundles).toBeDefined()
      expect(response.data.pagination).toBeDefined()
      expect(response.data.pagination.page).toBe(1)
      expect(response.data.pagination.limit).toBe(10)
    })

    it("filters bundles by status", async () => {
      // Create a mock request with status filter
      const request = {
        url: "http://localhost:3000/api/bundles?status=active",
      }

      const response = await GET(request)

      expect(NextResponse.json).toHaveBeenCalled()
      // All returned bundles should have active status
      expect(response.data.bundles.every((bundle) => bundle.status === "active")).toBe(true)
    })
  })

  describe("POST /api/bundles", () => {
    it("creates a new bundle with valid data", async () => {
      // Create a mock request with valid bundle data
      const request = {
        json: jest.fn().mockResolvedValue({
          name: "Test Bundle",
          description: "Test Description",
          products: [
            { id: "p1", name: "Product 1", price: 10 },
            { id: "p2", name: "Product 2", price: 20 },
          ],
          status: "draft",
        }),
      }

      const response = await POST(request)

      expect(NextResponse.json).toHaveBeenCalled()
      expect(response.options.status).toBe(201)
      expect(response.data.name).toBe("Test Bundle")
      expect(response.data.originalPrice).toBe(30) // 10 + 20
      expect(response.data.discountedPrice).toBe(27) // 30 * 0.9
    })

    it("returns an error when bundle has less than 2 products", async () => {
      // Create a mock request with invalid bundle data
      const request = {
        json: jest.fn().mockResolvedValue({
          name: "Test Bundle",
          description: "Test Description",
          products: [{ id: "p1", name: "Product 1", price: 10 }],
          status: "draft",
        }),
      }

      const response = await POST(request)

      expect(NextResponse.json).toHaveBeenCalled()
      expect(response.options.status).toBe(400)
      expect(response.data.error).toBe("Bundle must have a name and at least 2 products")
    })
  })
})
