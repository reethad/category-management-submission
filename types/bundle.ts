import type { Product } from "./product"

export interface Bundle {
  id: string
  name: string
  description: string
  products: Product[]
  originalPrice: number
  discountedPrice: number
  status: "active" | "draft"
  sellerId?: string
  createdAt?: string
  updatedAt?: string
  image?: string
}
