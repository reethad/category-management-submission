"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"

export default function ProductCard({ product }) {
  const { toast } = useToast()
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({ type: "product", item: product, quantity: 1 }))
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Use a placeholder image if the product image is not available
  const imageSrc = product.image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`

  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized={true}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        <div className="mt-2 mb-4">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="line-through text-muted-foreground">{formatCurrency(product.price)}</span>
              <span className="text-xl font-bold">{formatCurrency(product.salePrice)}</span>
              <span className="text-sm text-green-600">Save {formatCurrency(product.price - product.salePrice)}</span>
            </div>
          ) : (
            <div className="text-xl font-bold">{formatCurrency(product.price)}</div>
          )}
        </div>

        <Button className="w-full mt-2" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
