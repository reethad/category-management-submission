import BundleGrid from "../components/bundles/BundleGrid"

const BundlesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Product Bundles</h1>
      <p className="text-gray-500 mb-8">Save 10% when you purchase these curated product bundles</p>

      <BundleGrid />
    </div>
  )
}

export default BundlesPage
