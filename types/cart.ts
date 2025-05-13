export interface CartItem {
  type: "bundle" | "product"
  item: any // Using any to avoid circular dependencies and the need for imports
  quantity: number
}
