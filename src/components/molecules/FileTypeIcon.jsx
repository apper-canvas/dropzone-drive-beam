import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FileTypeIcon = ({ fileType, size = "md", className }) => {
  const getFileTypeInfo = (type) => {
    if (type.startsWith("image/")) {
      return { icon: "Image", color: "bg-emerald-100 text-emerald-600" }
    }
    if (type.startsWith("video/")) {
      return { icon: "Video", color: "bg-purple-100 text-purple-600" }
    }
    if (type.startsWith("audio/")) {
      return { icon: "Music", color: "bg-amber-100 text-amber-600" }
    }
    if (type.includes("pdf")) {
      return { icon: "FileText", color: "bg-red-100 text-red-600" }
    }
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) {
      return { icon: "Archive", color: "bg-gray-100 text-gray-600" }
    }
    if (type.includes("text") || type.includes("document")) {
      return { icon: "FileText", color: "bg-blue-100 text-blue-600" }
    }
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return { icon: "FileSpreadsheet", color: "bg-green-100 text-green-600" }
    }
    return { icon: "File", color: "bg-gray-100 text-gray-600" }
  }
  
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  }
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }
  
  const { icon, color } = getFileTypeInfo(fileType)
  
  return (
    <div className={cn(
      "rounded-lg flex items-center justify-center",
      sizes[size],
      color,
      className
    )}>
      <ApperIcon name={icon} size={iconSizes[size]} />
    </div>
  )
}

export default FileTypeIcon