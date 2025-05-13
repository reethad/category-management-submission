"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBundles } from "../../redux/slices/bundlesSlice"
import BundleCard from "./BundleCard"
import Loader from "../ui/Loader"
import Message from "../ui/Message"
import Pagination from "../ui/Pagination"

const BundleGrid = () => {
  const dispatch = useDispatch()
  const { items: bundles, status, error, pagination } = useSelector((state) => state.bundles)

  // Filter only active bundles for customer view
  const activeBundles = bundles.filter((bundle) => bundle.status === "active")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBundles({ status: "active" }))
    }
  }, [status, dispatch])

  const handlePageChange = (page) => {
    dispatch(fetchBundles({ page, status: "active" }))
  }

  if (status === "loading" && bundles.length === 0) {
    return <Loader />
  }

  if (status === "failed") {
    return <Message variant="error">{error}</Message>
  }

  if (activeBundles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No bundles available</h3>
        <p className="text-gray-500">Check back later for new bundle offers.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBundles.map((bundle) => (
          <BundleCard key={bundle._id} bundle={bundle} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  )
}

export default BundleGrid
