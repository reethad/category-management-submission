import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import BundleList from "@/components/seller/bundle-list"

export default function SellerBundlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Product Bundles</h1>
        <Button asChild>
          <Link href="/seller/bundles/new">
            <Plus className="mr-2 h-4 w-4" /> Create Bundle
          </Link>
        </Button>
      </div>

      <BundleList />
    </div>
  )
}
