import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Bundle Products, Boost Sales</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Create attractive product bundles with automatic discounts to increase your average order value and provide
          more value to your customers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/seller/bundles">Seller Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/bundles">View Bundles</Link>
          </Button>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/seller/bundles/new" className="block group">
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg transition-colors group-hover:bg-muted/80">
            <ShoppingBag className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Product Bundles</h3>
            <p className="text-center text-muted-foreground">
              Combine multiple products into attractive bundles with automatic 10% discounts.
            </p>
          </div>
        </Link>
        <Link href="/seller/bundles" className="block group">
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg transition-colors group-hover:bg-muted/80">
            <Package className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Manage Your Bundles</h3>
            <p className="text-center text-muted-foreground">
              Easily create, edit, and delete product bundles from your seller dashboard.
            </p>
          </div>
        </Link>
        <Link href="/dashboard" className="block group">
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg transition-colors group-hover:bg-muted/80">
            <BarChart className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Boost Your Sales</h3>
            <p className="text-center text-muted-foreground">
              Increase average order value and provide more value to your customers.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
