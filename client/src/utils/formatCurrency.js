/**
 * Format a number as currency
 * @param {number|string} value - The value to format
 * @param {string} locale - The locale to use (default: en-US)
 * @param {string} currency - The currency to use (default: USD)
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value, locale = "en-US", currency = "USD") => {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}
