import { cn } from "@/utils/cn"

const Loading = ({ className }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mx-auto"></div>
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading