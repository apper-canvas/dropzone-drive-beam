import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

const StatusMessage = ({ 
  type = "info", 
  message, 
  onDismiss,
  className,
  autoHide = false 
}) => {
  const types = {
    success: {
      icon: "CheckCircle",
      className: "bg-gradient-to-r from-success to-emerald-600 text-white",
      iconColor: "text-white"
    },
    error: {
      icon: "AlertCircle", 
      className: "bg-gradient-to-r from-error to-red-600 text-white",
      iconColor: "text-white"
    },
    warning: {
      icon: "AlertTriangle",
      className: "bg-gradient-to-r from-warning to-amber-600 text-white", 
      iconColor: "text-white"
    },
    info: {
      icon: "Info",
      className: "bg-gradient-to-r from-info to-blue-600 text-white",
      iconColor: "text-white"
    }
  }
  
  const config = types[type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg shadow-lg",
        config.className,
        className
      )}
    >
      <ApperIcon name={config.icon} size={20} className={config.iconColor} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <ApperIcon name="X" size={16} className={config.iconColor} />
        </button>
      )}
    </motion.div>
  )
}

export default StatusMessage