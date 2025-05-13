"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { removeFromCart, updateQuantity, clearCart } from "@/lib/redux/slices/cartSlice"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { items } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleRemoveItem = (type, id) => {
    dispatch(removeFromCart({ type, id }))
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const handleUpdateQuantity = (type, id, quantity) => {
    dispatch(updateQuantity({ type, id, quantity }))
  }

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "This is a demo. In a real app, this would proceed to checkout.",
    })
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const getItemPrice = (item) => {
    if (item.type === "bundle") {
      return item.item.discountedPrice
    } else {
      const product = item.item
      return product.salePrice !== undefined ? product.salePrice : product.price
    }
  }

  const getItemImage = (item) => {
    return item.item.image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(item.item.name)}`
  }

  const subtotal = items.reduce((total, item) => {
    return total + getItemPrice(item) * item.quantity
  }, 0)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-4">Your cart is empty</h3>
          <p className="text-muted-foreground mb-8">Add some items to your cart to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/bundles">Browse Bundles</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={`${item.type}-${item.item.id}`} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={getItemImage(item) || "/placeholder.svg"}
                      alt={item.item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-semibold text-lg">{item.item.name}</h3>
                      <div className="text-lg font-bold">{formatCurrency(getItemPrice(item) * item.quantity)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.type === "bundle" ? "Bundle" : "Product"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.type, item.item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.type, item.item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.type, item.item.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
