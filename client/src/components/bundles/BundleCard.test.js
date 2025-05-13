import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import { ToastContainer } from "react-toastify"
import BundleCard from "./BundleCard"

// Mock redux store
const mockStore = configureStore([])

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}))

describe("BundleCard Component", () => {
  let store
  const bundle = {
    _id: "1",
    name: "Test Bundle",
    description: "Test Description",
    products: [
      { id: "p1", name: "Product 1", price: 10 },
      { id: "p2", name: "Product 2", price: 20 },
    ],
    originalPrice: 30,
    discountedPrice: 27,
    status: "active",
    image: "/test-image.jpg",
  }

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [],
      },
    })
    store.dispatch = jest.fn()
  })

  it("renders the bundle information correctly", () => {
    render(
      <Provider store={store}>
        <BundleCard bundle={bundle} />
        <ToastContainer />
      </Provider>,
    )

    expect(screen.getByText("Test Bundle")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
    expect(screen.getByText("$30.00")).toBeInTheDocument() // Original price
    expect(screen.getByText("$27.00")).toBeInTheDocument() // Discounted price
    expect(screen.getByText("Save $3.00")).toBeInTheDocument() // Savings
    expect(screen.getByText("Product 1")).toBeInTheDocument()
    expect(screen.getByText("Product 2")).toBeInTheDocument()
    expect(screen.getByText("Add to Cart")).toBeInTheDocument()
  })

  it("dispatches addToCart action when Add to Cart button is clicked", () => {
    render(
      <Provider store={store}>
        <BundleCard bundle={bundle} />
        <ToastContainer />
      </Provider>,
    )

    fireEvent.click(screen.getByText("Add to Cart"))

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "cart/addToCart",
      payload: {
        type: "bundle",
        item: bundle,
        quantity: 1,
      },
    })
  })

  it("uses placeholder image when no image is provided", () => {
    const bundleWithoutImage = {
      ...bundle,
      image: null,
    }

    render(
      <Provider store={store}>
        <BundleCard bundle={bundleWithoutImage} />
        <ToastContainer />
      </Provider>,
    )

    const img = screen.getByAltText("Test Bundle")
    expect(img.src).toContain("/placeholder.svg")
  })
})
