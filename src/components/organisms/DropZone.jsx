import { useState, useRef } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"

const DropZone = ({ onFilesSelected, isDisabled = false, maxFiles = 10, maxFileSize = 10 * 1024 * 1024, allowedTypes = [] }) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDisabled) {
      setIsDragOver(true)
    }
  }
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDisabled) {
      setIsDragActive(true)
    }
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDisabled) {
      setIsDragActive(false)
      setIsDragOver(false)
    }
  }
  
  const validateFiles = (files) => {
    const validFiles = []
    const errors = []
    
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return { validFiles: [], errors }
    }
    
    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`)
      } else if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
        errors.push(`${file.name} file type not supported`)
      } else {
        validFiles.push(file)
      }
    })
    
    return { validFiles, errors }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDisabled) return
    
    setIsDragActive(false)
    setIsDragOver(false)
    
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      const { validFiles, errors } = validateFiles(files)
      
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error))
      }
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
        toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} selected`)
      }
    }
  }
  
  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const { validFiles, errors } = validateFiles(files)
      
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error))
      }
      
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
        toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} selected`)
      }
    }
    // Reset input
    e.target.value = ""
  }
  
  const openFilePicker = () => {
    if (!isDisabled) {
      fileInputRef.current?.click()
    }
  }
  
  return (
    <motion.div
      className={cn(
        "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
        "min-h-[300px] flex flex-col items-center justify-center p-8 text-center",
        !isDisabled && !isDragActive && !isDragOver && "border-gray-300 hover:border-primary hover:bg-blue-50/50 hover:scale-[1.02]",
        !isDisabled && (isDragActive || isDragOver) && "border-primary bg-blue-50 scale-[1.02] shadow-lg",
        isDisabled && "border-gray-200 cursor-not-allowed opacity-50"
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFilePicker}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled}
      />
      
      <motion.div 
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-6",
          "bg-gradient-to-br from-blue-100 to-blue-200",
          isDragActive && "from-primary/20 to-primary/30"
        )}
        animate={isDragActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon 
          name={isDragActive ? "Download" : "Upload"} 
          size={32} 
          className={cn(
            "transition-colors duration-200",
            isDragActive ? "text-primary" : "text-primary/70"
          )} 
        />
      </motion.div>
      
      <div className="space-y-2 mb-6">
        <h3 className={cn(
          "text-xl font-semibold transition-colors duration-200",
          isDragActive ? "text-primary" : "text-gray-900"
        )}>
          {isDragActive ? "Drop files here" : "Upload your files"}
        </h3>
        <p className="text-gray-600">
          {isDragActive 
            ? "Release to upload" 
            : "Drag and drop files here, or click to browse"
          }
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <ApperIcon name="Files" size={16} />
          <span>Max {maxFiles} files</span>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="HardDrive" size={16} />
          <span>Max {Math.round(maxFileSize / 1024 / 1024)}MB each</span>
        </div>
      </div>
      
      {isDragActive && (
        <motion.div
          className="absolute inset-0 bg-primary/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

export default DropZone