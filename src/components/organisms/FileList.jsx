import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import FileTypeIcon from "@/components/molecules/FileTypeIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ProgressBar from "@/components/atoms/ProgressBar"
import Empty from "@/components/ui/Empty"
import { cn } from "@/utils/cn"
import { formatBytes } from "@/utils/formatters"

const FileList = ({ files = [], onRemoveFile, onRetryUpload, className }) => {
  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "default", text: "Pending", icon: "Clock" },
      uploading: { variant: "uploading", text: "Uploading", icon: "Upload" },
      completed: { variant: "success", text: "Completed", icon: "CheckCircle" },
      error: { variant: "error", text: "Failed", icon: "XCircle" }
    }
    
    return variants[status] || variants.pending
  }
  
  if (files.length === 0) {
    return (
      <Empty 
        title="No files selected"
        message="Choose files to upload and they will appear here"
        icon="FileX"
        className={className}
      />
    )
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Files ({files.length})
        </h3>
        {files.some(file => file.status === "completed") && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const completedFiles = files.filter(f => f.status === "completed")
              completedFiles.forEach(file => onRemoveFile(file.id))
            }}
          >
            <ApperIcon name="Trash2" size={16} />
            Clear Completed
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {files.map((file) => {
            const statusInfo = getStatusBadge(file.status)
            
            return (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <FileTypeIcon fileType={file.type} size="md" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                      <Badge variant={statusInfo.variant}>
                        <ApperIcon name={statusInfo.icon} size={12} className="mr-1" />
                        {statusInfo.text}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatBytes(file.size)}</span>
                      {file.uploadedAt && (
                        <span>Uploaded {new Date(file.uploadedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                    
                    {file.status === "uploading" && (
                      <div className="mt-2">
                        <ProgressBar 
                          value={file.uploadProgress} 
                          size="sm"
                          showPercentage={false}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{Math.round(file.uploadProgress)}%</span>
                          <span>{formatBytes(file.size * file.uploadProgress / 100)} / {formatBytes(file.size)}</span>
                        </div>
                      </div>
                    )}
                    
                    {file.status === "error" && file.error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 p-2 bg-red-50 rounded-md"
                      >
                        <p className="text-sm text-error flex items-center gap-2">
                          <ApperIcon name="AlertCircle" size={14} />
                          {file.error}
                        </p>
                      </motion.div>
                    )}
                    
                    {file.status === "completed" && file.url && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 p-2 bg-green-50 rounded-md"
                      >
                        <div className="flex items-center gap-2 text-sm text-success">
                          <ApperIcon name="Link" size={14} />
                          <span className="font-mono text-xs truncate flex-1">{file.url}</span>
                          <button 
                            onClick={() => navigator.clipboard.writeText(file.url)}
                            className="p-1 hover:bg-green-100 rounded"
                            title="Copy link"
                          >
                            <ApperIcon name="Copy" size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === "error" && onRetryUpload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetryUpload(file.id)}
                        className="text-primary hover:text-primary hover:bg-blue-50"
                      >
                        <ApperIcon name="RotateCcw" size={16} />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(file.id)}
                      className="text-gray-400 hover:text-error hover:bg-red-50"
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FileList