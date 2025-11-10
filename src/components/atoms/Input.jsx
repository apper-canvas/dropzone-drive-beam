import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input