"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchBundles, deleteBundle } from "../../redux/slices/bundlesSlice"
import { formatCurrency } from "../../utils/formatCurrency"
import { toast } from "react-toastify"
import Loader from "../ui/Loader"
import Message from "../ui/Message"
import Modal from "../ui/Modal"

const BundleList = () => {
  const dispatch = useDispatch()
  const { items: bundles, status, error } = useSelector((state) => state.bundles)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bundleToDelete, setBundleToDelete] = useState(null)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBundles())
    }
  }, [status, dispatch])

  const handleDeleteClick = (bundle) => {
    setBundleToDelete(bundle)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteBundle(bundleToDelete._id)).unwrap()
      toast.success("The bundle has been successfully deleted.")
      setDeleteModalOpen(false)
      setBundleToDelete(null)
    } catch (error) {
      toast.error("Failed to delete bundle. Please try again.")
    }
  }

  if (status === "loading") {
    return <Loader />
  }

  if (status === "failed") {
    return <Message variant="error">{error}</Message>
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bundle Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Products
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Original Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Discounted Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bundles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No bundles found. Create your first bundle to get started.
                </td>
              </tr>
            ) : (
              bundles.map((bundle) => (
                <tr key={bundle._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{bundle.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{bundle.products.length} products</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(bundle.originalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(bundle.discountedPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bundle.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {bundle.status === "active" ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link to={`/seller/bundles/${bundle._id}/edit`} className="text-blue-600 hover:text-blue-900">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button onClick={() => handleDeleteClick(bundle)} className="text-red-600 hover:text-red-900">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Bundle">
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this bundle? This action cannot be undone.
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  )
}

export default BundleList
