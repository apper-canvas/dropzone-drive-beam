import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const ActionBar = ({ 
  files = [],
  onUploadAll,
  onClearAll,
  onClearCompleted,
  isUploading = false,
  className 
}) => {
  const pendingFiles = files.filter(file => file.status === "pending")
  const completedFiles = files.filter(file => file.status === "completed")
  const failedFiles = files.filter(file => file.status === "error")
  
  if (files.length === 0) {
    return null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border border-gray-100",
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <ApperIcon name="Files" size={16} />
            <span>{files.length} total</span>
          </div>
          
          {pendingFiles.length > 0 && (
            <div className="flex items-center gap-1 text-primary">
              <ApperIcon name="Clock" size={16} />
              <span>{pendingFiles.length} pending</span>
            </div>
          )}
          
          {completedFiles.length > 0 && (
            <div className="flex items-center gap-1 text-success">
              <ApperIcon name="CheckCircle" size={16} />
              <span>{completedFiles.length} completed</span>
            </div>
          )}
          
          {failedFiles.length > 0 && (
            <div className="flex items-center gap-1 text-error">
              <ApperIcon name="XCircle" size={16} />
              <span>{failedFiles.length} failed</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {completedFiles.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
          >
            <ApperIcon name="CheckCheck" size={16} />
            Clear Completed
          </Button>
        )}
        
        {files.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-500 hover:text-error hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
            Clear All
          </Button>
        )}
        
        {pendingFiles.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUploadAll}
            disabled={isUploading}
          >
            <ApperIcon 
              name={isUploading ? "Loader2" : "Upload"} 
              size={16} 
              className={isUploading ? "animate-spin" : ""} 
            />
            {isUploading ? "Uploading..." : `Upload All (${pendingFiles.length})`}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default ActionBar