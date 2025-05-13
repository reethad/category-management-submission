"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatCurrency } from "@/lib/utils"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function SellerTab() {
  const { items: bundles } = useAppSelector((state) => state.bundles)

  // Filter only the bundles for this seller
  const sellerBundles = bundles.filter((bundle) => bundle.sellerId === "s1")

  // Calculate some stats
  const totalBundles = sellerBundles.length
  const activeBundles = sellerBundles.filter((bundle) => bundle.status === "active").length
  const draftBundles = sellerBundles.filter((bundle) => bundle.status === "draft").length

  // Mock sales data
  const totalSales = 2345.67
  const monthlySales = 789.12

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        <Button asChild>
          <Link href="/seller/bundles">Manage Bundles</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlySales)}</div>
            <p className="text-xs text-muted-foreground">+4.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bundles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeBundles} / {totalBundles}
            </div>
            <p className="text-xs text-muted-foreground">{draftBundles} bundles in draft</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your sales performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Sales chart visualization</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bundle Performance</CardTitle>
            <CardDescription>How your bundles are performing</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Bundle performance visualization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Distribution of sales across product categories</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center">
            <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Category distribution visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
