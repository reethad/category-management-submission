/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Validate bundle data
 * @param {object} bundle - The bundle data to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateBundle = (bundle) => {
  const errors = {}

  if (!bundle.name || bundle.name.trim() === "") {
    errors.name = "Bundle name is required"
  }

  if (!bundle.products || bundle.products.length < 2) {
    errors.products = "Bundle must contain at least 2 products"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate product data
 * @param {object} product - The product data to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateProduct = (product) => {
  const errors = {}

  if (!product.name || product.name.trim() === "") {
    errors.name = "Product name is required"
  }

  if (!product.price || isNaN(product.price) || product.price <= 0) {
    errors.price = "Product price must be a positive number"
  }

  if (product.salePrice !== undefined && (isNaN(product.salePrice) || product.salePrice < 0)) {
    errors.salePrice = "Sale price must be a non-negative number"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
