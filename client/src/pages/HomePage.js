import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Bundle Products, Boost Sales</h1>
        <p className="max-w-[700px] text-lg text-gray-500">
          Create attractive product bundles with automatic discounts to increase your average order value and provide
          more value to your customers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/seller/bundles"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Seller Dashboard
          </Link>
          <Link
            to="/bundles"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            View Bundles
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/seller/bundles/new" className="block group">
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg transition-colors group-hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Create Product Bundles</h3>
            <p className="text-center text-gray-500">
              Combine multiple products into attractive bundles with automatic 10% discounts.
            </p>
          </div>
        </Link>
        <Link to="/seller/bundles" className="block group">
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg transition-colors group-hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Manage Your Bundles</h3>
            <p className="text-center text-gray-500">
              Easily create, edit, and delete product bundles from your seller dashboard.
            </p>
          </div>
        </Link>
        <Link to="/dashboard" className="block group">
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg transition-colors group-hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Boost Your Sales</h3>
            <p className="text-center text-gray-500">
              Increase average order value and provide more value to your customers.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
