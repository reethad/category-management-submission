"use client"

import { useEffect } from "react"
import BundleCard from "@/components/bundles/bundle-card"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchBundles } from "@/lib/redux/slices/bundlesSlice"

export default function BundleGrid() {
  const dispatch = useAppDispatch()
  const { items: bundles, status, error } = useAppSelector((state) => state.bundles)

  // Filter only active bundles for customer view
  const activeBundles = bundles.filter((bundle) => bundle.status === "active")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBundles())
    }
  }, [status, dispatch])

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading bundles...</div>
  }

  if (status === "failed") {
    return <div className="flex justify-center p-8 text-red-500">Error loading bundles: {error}</div>
  }

  if (activeBundles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No bundles available</h3>
        <p className="text-muted-foreground">Check back later for new bundle offers.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeBundles.map((bundle) => (
        <BundleCard key={bundle.id} bundle={bundle} />
      ))}
    </div>
  )
}
