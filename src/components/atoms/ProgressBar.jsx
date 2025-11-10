import React from "react"
import { cn } from "@/utils/cn"

const ProgressBar = React.forwardRef(({ 
  className, 
  value = 0,
  max = 100,
  showPercentage = true,
  size = "md",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }
  
  return (
    <div className={cn("w-full", className)} ref={ref} {...props}>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size]
      )}>
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-600 mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
})

ProgressBar.displayName = "ProgressBar"

export default ProgressBar