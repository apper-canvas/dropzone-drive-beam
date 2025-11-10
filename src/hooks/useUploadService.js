import { useState, useCallback } from "react"
import { uploadService } from "@/services/api/uploadService"
import { generateFileId } from "@/utils/formatters"
import { toast } from "react-toastify"

export const useUploadService = () => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Add files to the list
  const addFiles = useCallback((newFiles) => {
    const fileObjects = Array.from(newFiles).map(file => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending",
      uploadProgress: 0,
      uploadedAt: null,
      url: null,
      error: null,
      file: file // Keep reference to actual File object
    }))

    setFiles(prev => [...prev, ...fileObjects])
    setError(null)
  }, [])

  // Remove a file
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  // Upload a single file
  const uploadFile = useCallback(async (fileId) => {
    const fileItem = files.find(f => f.id === fileId)
    if (!fileItem || !fileItem.file) return

    setError(null)
    
    // Update file status to uploading
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status: "uploading", uploadProgress: 0, error: null }
        : file
    ))

    try {
      const result = await uploadService.uploadFile(
        fileItem.file,
        (progress, data) => {
          setFiles(prev => prev.map(file =>
            file.id === fileId
              ? { ...file, uploadProgress: progress }
              : file
          ))
        }
      )

      if (result.success) {
        setFiles(prev => prev.map(file =>
          file.id === fileId
            ? {
                ...file,
                status: "completed",
                uploadProgress: 100,
                uploadedAt: result.data.uploadedAt,
                url: result.data.url
              }
            : file
        ))
      } else {
        setFiles(prev => prev.map(file =>
          file.id === fileId
            ? {
                ...file,
                status: "error",
                error: result.error
              }
            : file
        ))
      }

      return result

    } catch (err) {
      const errorMessage = err.message || "Upload failed"
      setFiles(prev => prev.map(file =>
        file.id === fileId
          ? { ...file, status: "error", error: errorMessage }
          : file
      ))
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [files])

  // Upload all pending files
  const uploadAll = useCallback(async () => {
    const pendingFiles = files.filter(file => file.status === "pending")
    if (pendingFiles.length === 0) return { success: true, uploadedCount: 0 }

    setIsUploading(true)
    setError(null)

    try {
      let successCount = 0
      
      for (const file of pendingFiles) {
        const result = await uploadFile(file.id)
        if (result && result.success) {
          successCount++
        }
      }

      return { success: true, uploadedCount: successCount }

    } catch (err) {
      const errorMessage = err.message || "Failed to upload files"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUploading(false)
    }
  }, [files, uploadFile])

  // Retry failed upload
  const retryUpload = useCallback(async (fileId) => {
    return await uploadFile(fileId)
  }, [uploadFile])

  // Clear completed files
  const clearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(file => file.status !== "completed"))
  }, [])

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles([])
    setError(null)
  }, [])

  return {
    files,
    isUploading,
    error,
    loading,
    addFiles,
    removeFile,
    uploadFile,
    uploadAll,
    retryUpload,
    clearCompleted,
    clearAll
  }
}