import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We encountered an error while processing your request.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50", className)}>
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {onRetry && (
          <button 
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorView