import PropTypes from "prop-types"

const Message = ({ variant = "info", children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "error":
        return "bg-red-100 text-red-700 border-red-200"
      case "success":
        return "bg-green-100 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  return (
    <div className={`p-4 mb-4 rounded-md border ${getVariantClasses()}`} role="alert">
      {children}
    </div>
  )
}

Message.propTypes = {
  variant: PropTypes.oneOf(["info", "error", "success", "warning"]),
  children: PropTypes.node.isRequired,
}

export default Message
