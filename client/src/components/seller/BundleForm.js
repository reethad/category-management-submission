"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchProducts } from "../../redux/slices/productsSlice"
import { addBundle, updateBundle, fetchBundle } from "../../redux/slices/bundlesSlice"
import { formatCurrency } from "../../utils/formatCurrency"
import { validateBundle } from "../../utils/validators"
import { toast } from "react-toastify"
import Loader from "../ui/Loader"
import Message from "../ui/Message"

const BundleForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { items: products, status: productsStatus, error: productsError } = useSelector((state) => state.products)
  const { items: bundles, status: bundlesStatus, error: bundlesError } = useSelector((state) => state.bundles)

  const existingBundle = id ? bundles.find((b) => b._id === id) : null

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft",
    products: [],
  })
  const [formErrors, setFormErrors] = useState({})
  const [selectedProductId, setSelectedProductId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch products if not already loaded
    if (productsStatus === "idle") {
      dispatch(fetchProducts())
    }

    // Fetch bundle if editing and not already loaded
    if (id && bundlesStatus !== "loading" && !existingBundle) {
      dispatch(fetchBundle(id))
    }

    // Update form data if bundle is loaded after component mount
    if (existingBundle && !formData.name) {
      setFormData({
        name: existingBundle.name || "",
        description: existingBundle.description || "",
        status: existingBundle.status || "draft",
        products: existingBundle.products || [],
      })
    }
  }, [dispatch, productsStatus, bundlesStatus, existingBundle, formData.name, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.value }))
  }

  const handleAddProduct = () => {
    if (!selectedProductId) return

    const productToAdd = products.find((p) => p._id === selectedProductId)
    if (!productToAdd) return

    // Check if product is already in the bundle
    if (formData.products.some((p) => p._id === productToAdd._id)) {
      toast.error("This product is already in the bundle.")
      return
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, productToAdd],
    }))
    setSelectedProductId("")

    // Clear products error if it exists
    if (formErrors.products) {
      setFormErrors((prev) => ({ ...prev, products: undefined }))
    }
  }

  const handleRemoveProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p._id !== productId),
    }))
  }

  const calculatePrices = () => {
    const originalPrice = formData.products.reduce((sum, product) => {
      // Use sale price if available, otherwise use regular price
      const productPrice = product.salePrice !== undefined ? product.salePrice : product.price
      return sum + productPrice
    }, 0)

    const discountedPrice = originalPrice * 0.9 // 10% discount

    return {
      originalPrice: Number.parseFloat(originalPrice.toFixed(2)),
      discountedPrice: Number.parseFloat(discountedPrice.toFixed(2)),
      savings: Number.parseFloat((originalPrice - discountedPrice).toFixed(2)),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const { isValid, errors } = validateBundle(formData)

    if (!isValid) {
      setFormErrors(errors)
      Object.values(errors).forEach((error) => {
        toast.error(error)
      })
      return
    }

    setIsSubmitting(true)

    try {
      const prices = calculatePrices()

      const bundleData = {
        name: formData.name,
        description: formData.description,
        products: formData.products,
        status: formData.status,
        originalPrice: prices.originalPrice,
        discountedPrice: prices.discountedPrice,
      }

      if (existingBundle) {
        await dispatch(
          updateBundle({
            id: id,
            bundle: bundleData,
          }),
        ).unwrap()

        toast.success("Your bundle has been updated successfully.")
      } else {
        await dispatch(addBundle(bundleData)).unwrap()

        toast.success("Your bundle has been created successfully.")
      }

      // Redirect to bundles list
      navigate("/seller/bundles")
    } catch (error) {
      toast.error(
        existingBundle ? "Failed to update bundle. Please try again." : "Failed to create bundle. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const prices = calculatePrices()

  if (productsStatus === "loading" && products.length === 0) {
    return <Loader />
  }

  if (productsStatus === "failed") {
    return <Message variant="error">{productsError}</Message>
  }

  if (id && bundlesStatus === "loading" && !existingBundle) {
    return <Loader />
  }

  if (id && bundlesStatus === "failed") {
    return <Message variant="error">{bundlesError}</Message>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Bundle Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Summer Essentials"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your bundle..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Bundle Summary</h3>
            <p className="text-sm text-gray-500 mb-4">Bundle pricing and discount information</p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span>{formatCurrency(prices.originalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounted Price:</span>
                <span className="font-bold">{formatCurrency(prices.discountedPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Customer Savings:</span>
                <span>{formatCurrency(prices.savings)} (10%)</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Bundles automatically receive a 10% discount off the total price.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Bundle Products</h3>
        <p className="text-sm text-gray-500">Add at least 2 products to create a bundle.</p>

        <div className="flex gap-2">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full md:w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - {formatCurrency(product.price)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </div>

        <div className={`border rounded-lg p-4 ${formErrors.products ? "border-red-500" : ""}`}>
          {formData.products.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No products added yet. Add at least 2 products to create a bundle.
            </p>
          ) : (
            <ul className="space-y-2">
              {formData.products.map((product) => (
                <li key={product._id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <span>{product.name}</span>
                  <div className="flex items-center gap-4">
                    <span>{formatCurrency(product.price)}</span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Remove</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {formErrors.products && <p className="text-red-500 text-xs mt-1">{formErrors.products}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => navigate("/seller/bundles")}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : existingBundle ? "Update Bundle" : "Create Bundle"}
        </button>
      </div>
    </form>
  )
}

export default BundleForm
