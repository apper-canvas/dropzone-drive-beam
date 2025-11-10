import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Empty = ({ 
  title = "No files uploaded",
  message = "Upload your first files to get started.",
  icon = "Upload",
  action,
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={28} className="text-slate-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500">{message}</p>
        </div>
        
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

export default Empty