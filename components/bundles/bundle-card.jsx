"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"

export default function BundleCard({ bundle }) {
  const { toast } = useToast()
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({ type: "bundle", item: bundle, quantity: 1 }))
    toast({
      title: "Added to cart",
      description: `${bundle.name} has been added to your cart.`,
    })
  }

  // Use a placeholder image if the bundle image is not available
  const imageSrc = bundle.image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(bundle.name)}`

  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={bundle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized={true}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{bundle.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>

        <div className="space-y-1 mb-4">
          <div className="text-sm">
            <span className="line-through text-muted-foreground">{formatCurrency(bundle.originalPrice)}</span>
            <span className="ml-2 text-green-600">
              Save {formatCurrency(bundle.originalPrice - bundle.discountedPrice)}
            </span>
          </div>
          <div className="text-xl font-bold">{formatCurrency(bundle.discountedPrice)}</div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Includes:</p>
          <ul className="text-sm space-y-1">
            {bundle.products.map((product) => (
              <li key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span className="text-muted-foreground">{formatCurrency(product.price)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full mt-4" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
