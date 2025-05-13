"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import ProductCard from "@/components/products/product-card"

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items: products, status, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  if (status === "failed") {
    return <div className="flex justify-center p-8 text-red-500">Error loading products: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Products</h1>
      <p className="text-muted-foreground mb-8">Browse our collection of products</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
