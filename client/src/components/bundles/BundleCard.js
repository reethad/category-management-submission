"use client"

import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/slices/cartSlice"
import { formatCurrency } from "../../utils/formatCurrency"
import { toast } from "react-toastify"

const BundleCard = ({ bundle }) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({ type: "bundle", item: bundle, quantity: 1 }))
    toast.success(`${bundle.name} has been added to your cart.`)
  }

  // Calculate savings
  const savings = bundle.originalPrice - bundle.discountedPrice

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={bundle.image || `/placeholder.svg?text=${encodeURIComponent(bundle.name)}`}
          alt={bundle.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{bundle.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bundle.description}</p>

        <div className="space-y-1 mb-4">
          <div className="text-sm">
            <span className="line-through text-gray-500">{formatCurrency(bundle.originalPrice)}</span>
            <span className="ml-2 text-green-600">Save {formatCurrency(savings)}</span>
          </div>
          <div className="text-xl font-bold">{formatCurrency(bundle.discountedPrice)}</div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Includes:</p>
          <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
            {bundle.products.map((product) => (
              <li key={product._id} className="flex justify-between">
                <span className="truncate mr-2">{product.name}</span>
                <span className="text-gray-500 whitespace-nowrap">{formatCurrency(product.price)}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

BundleCard.propTypes = {
  bundle: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    products: PropTypes.array.isRequired,
    originalPrice: PropTypes.number.isRequired,
    discountedPrice: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
}

export default BundleCard
