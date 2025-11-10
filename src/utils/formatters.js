export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes"
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const generateShareableUrl = (fileId, fileName) => {
  // Simulate a shareable URL
  const domain = "https://dropzone.app"
  const cleanName = fileName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  return `${domain}/f/${fileId}/${cleanName}`
}

export const getMimeTypeCategory = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video" 
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType.includes("pdf")) return "pdf"
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) return "archive"
  if (mimeType.includes("text") || mimeType.includes("document")) return "document"
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "spreadsheet"
  return "file"
}