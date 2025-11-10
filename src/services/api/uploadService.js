import { generateFileId, generateShareableUrl } from "@/utils/formatters"

// Simulate upload delay
const UPLOAD_DELAY = 300
const PROGRESS_STEPS = 20

class UploadService {
  constructor() {
    this.uploads = new Map()
  }

  // Simulate file upload with progress
  async uploadFile(file, onProgress) {
    const fileId = generateFileId()
    const uploadData = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      uploadProgress: 0,
      uploadedAt: null,
      url: null,
      error: null
    }

    this.uploads.set(fileId, uploadData)

    try {
      // Simulate upload progress
      for (let i = 0; i <= PROGRESS_STEPS; i++) {
        await new Promise(resolve => setTimeout(resolve, UPLOAD_DELAY))
        
        const progress = (i / PROGRESS_STEPS) * 100
        uploadData.uploadProgress = progress
        
        if (onProgress) {
          onProgress(progress, uploadData)
        }

        // Simulate occasional upload failures (5% chance)
        if (i === Math.floor(PROGRESS_STEPS * 0.7) && Math.random() < 0.05) {
          throw new Error("Network connection failed")
        }
      }

      // Upload completed successfully
      uploadData.status = "completed"
      uploadData.uploadedAt = Date.now()
      uploadData.url = generateShareableUrl(fileId, file.name)
      
      return { success: true, data: uploadData }

    } catch (error) {
      uploadData.status = "error"
      uploadData.error = error.message || "Upload failed"
      
      return { success: false, error: error.message, data: uploadData }
    }
  }

  // Upload multiple files
  async uploadFiles(files, onProgress, onFileComplete) {
    const results = {
      successful: [],
      failed: [],
      total: files.length
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      const result = await this.uploadFile(file, (progress, data) => {
        if (onProgress) {
          onProgress(i, progress, data)
        }
      })

      if (result.success) {
        results.successful.push(result.data)
      } else {
        results.failed.push(result.data)
      }

      if (onFileComplete) {
        onFileComplete(result.data, i + 1, files.length)
      }
    }

    return results
  }

  // Cancel upload (simulate)
  cancelUpload(fileId) {
    const uploadData = this.uploads.get(fileId)
    if (uploadData && uploadData.status === "uploading") {
      uploadData.status = "error" 
      uploadData.error = "Upload cancelled by user"
      return true
    }
    return false
  }

  // Get upload info
  getUpload(fileId) {
    return this.uploads.get(fileId)
  }

  // Remove upload record
  removeUpload(fileId) {
    return this.uploads.delete(fileId)
  }

  // Validate file
  validateFile(file, maxSize = 10 * 1024 * 1024, allowedTypes = []) {
    const errors = []

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
    }

    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.includes(type))) {
      errors.push("File type not supported")
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService()