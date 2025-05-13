"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function TestDiscountPage() {
  const [bundleId, setBundleId] = useState("1")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkDiscount = async () => {
    setLoading(true)
    setError(null)
    setResult(null) // Clear previous results

    try {
      const response = await fetch(`/api/bundles/${bundleId}/checkDiscount`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to check discount")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Error checking discount:", err)
      setError(err.message || "An error occurred while checking the discount")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Test Discount Endpoint</h1>

      <div className="max-w-md mx-auto">
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="bundleId">Bundle ID</Label>
            <div className="flex gap-2">
              <Input
                id="bundleId"
                value={bundleId}
                onChange={(e) => setBundleId(e.target.value)}
                placeholder="Enter bundle ID"
              />
              <Button onClick={checkDiscount} disabled={loading}>
                {loading ? "Checking..." : "Check Discount"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Try IDs: 1, 2, 3, or any invalid ID to test error handling</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Discount Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Bundle ID:</span>
                <span>{result.bundleId}</span>

                <span className="font-medium">Name:</span>
                <span>{result.name}</span>

                <span className="font-medium">Original Price:</span>
                <span>{formatCurrency(result.originalPrice)}</span>

                <span className="font-medium">Discounted Price:</span>
                <span>{formatCurrency(result.discountedPrice)}</span>

                <span className="font-medium">Savings:</span>
                <span>
                  {formatCurrency(result.savings)} ({result.discountPercentage}%)
                </span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Products:</h3>
                <ul className="space-y-1">
                  {result.products.map((product) => (
                    <li key={product.id} className="flex justify-between">
                      <span>{product.name}</span>
                      <span>{formatCurrency(product.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
