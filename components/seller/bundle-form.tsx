"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addBundle, updateBundle } from "@/lib/redux/slices/bundlesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import type { Product } from "@/types/product"

interface BundleFormProps {
  bundleId?: string
}

export default function BundleForm({ bundleId }: BundleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()

  const { items: products, status: productsStatus } = useAppSelector((state) => state.products)
  const { items: bundles } = useAppSelector((state) => state.bundles)

  const existingBundle = bundleId ? bundles.find((b) => b.id === bundleId) : null

  const [formData, setFormData] = useState<{
    name: string
    description: string
    status: "active" | "draft"
    products: Product[]
  }>({
    name: existingBundle?.name || "",
    description: existingBundle?.description || "",
    status: existingBundle?.status || "draft",
    products: existingBundle?.products || [],
  })

  const [selectedProductId, setSelectedProductId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts())
    }

    // Update form data if bundle is loaded after component mount
    if (existingBundle && !formData.name) {
      setFormData({
        name: existingBundle.name,
        description: existingBundle.description,
        status: existingBundle.status,
        products: existingBundle.products,
      })
    }
  }, [dispatch, productsStatus, existingBundle, formData.name])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleAddProduct = () => {
    if (!selectedProductId) return

    const productToAdd = products.find((p) => p.id === selectedProductId)
    if (!productToAdd) return

    // Check if product is already in the bundle
    if (formData.products.some((p) => p.id === productToAdd.id)) {
      toast({
        title: "Product already added",
        description: "This product is already in the bundle.",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, productToAdd],
    }))
    setSelectedProductId("")
  }

  const handleRemoveProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }))
  }

  const calculatePrices = () => {
    const originalPrice = formData.products.reduce((sum, product) => {
      // Use sale price if available, otherwise use regular price
      const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
      return sum + productPrice
    }, 0)

    const discountedPrice = originalPrice * 0.9 // 10% discount

    return {
      originalPrice: originalPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      savings: (originalPrice - discountedPrice).toFixed(2),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Bundle name is required.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (formData.products.length < 2) {
      toast({
        title: "Validation error",
        description: "A bundle must contain at least 2 different products.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const prices = calculatePrices()

      const bundleData = {
        name: formData.name,
        description: formData.description,
        products: formData.products,
        status: formData.status,
        originalPrice: Number.parseFloat(prices.originalPrice),
        discountedPrice: Number.parseFloat(prices.discountedPrice),
      }

      if (existingBundle) {
        await dispatch(
          updateBundle({
            id: bundleId as string,
            bundle: bundleData,
          }),
        ).unwrap()

        toast({
          title: "Bundle updated",
          description: "Your bundle has been updated successfully.",
        })
      } else {
        await dispatch(addBundle(bundleData)).unwrap()

        toast({
          title: "Bundle created",
          description: "Your bundle has been created successfully.",
        })
      }

      // Redirect to bundles list
      router.push("/seller/bundles")
    } catch (error) {
      toast({
        title: "Error",
        description: existingBundle
          ? "Failed to update bundle. Please try again."
          : "Failed to create bundle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const prices = calculatePrices()
  const isValid = formData.name.trim() && formData.products.length >= 2

  if (productsStatus === "loading") {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bundle Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Summer Essentials"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your bundle..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Summary</CardTitle>
              <CardDescription>Bundle pricing and discount information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span>{formatCurrency(prices.originalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounted Price:</span>
                <span className="font-bold">{formatCurrency(prices.discountedPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Customer Savings:</span>
                <span>{formatCurrency(prices.savings)} (10%)</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Bundles automatically receive a 10% discount off the total price.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Bundle Products</h3>
        <p className="text-sm text-muted-foreground">Add at least 2 products to create a bundle.</p>

        <div className="flex gap-2">
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {formatCurrency(product.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          {formData.products.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No products added yet. Add at least 2 products to create a bundle.
            </p>
          ) : (
            <ul className="space-y-2">
              {formData.products.map((product) => (
                <li key={product.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>{product.name}</span>
                  <div className="flex items-center gap-4">
                    <span>{formatCurrency(product.price)}</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveProduct(product.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/seller/bundles")}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : existingBundle ? "Update Bundle" : "Create Bundle"}
        </Button>
      </div>
    </form>
  )
}
