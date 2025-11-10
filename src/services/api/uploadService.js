import { generateFileId, generateShareableUrl } from "@/utils/formatters"

// Simulate upload delay
const UPLOAD_DELAY = 300
const PROGRESS_STEPS = 20

class UploadService {
  constructor() {
    this.uploads = new Map()
    this.apperClient = null
  }

  // Initialize Apper client
  initializeApperClient() {
    try {
      if (window.ApperSDK && !this.apperClient) {
        const { ApperClient } = window.ApperSDK
        this.apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        })
      }
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error)
    }
  }

  // Convert API format to UI format
  toUIFormat(files) {
    if (!files || !Array.isArray(files)) return []
    
    return files.map(file => ({
      id: file.id || generateFileId(),
      name: file.name || file.filename || 'Unknown',
      size: file.size || 0,
      type: file.type || file.contentType || 'application/octet-stream',
      status: 'completed',
      uploadProgress: 100,
      uploadedAt: file.uploadedAt || file.createdAt || Date.now(),
      url: file.url || file.downloadUrl,
      error: null
    }))
  }

  // Convert UI format to API format
  toAPIFormat(files) {
    if (!files || !Array.isArray(files)) return []
    
    return files.map(file => ({
      id: file.id,
      name: file.name,
      filename: file.name,
      size: file.size,
      type: file.type,
      contentType: file.type,
      url: file.url,
      downloadUrl: file.url,
      uploadedAt: file.uploadedAt,
      createdAt: file.uploadedAt
    }))
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

  // Upload file using ApperSDK (when available)
  async uploadFileWithApper(file, fieldKey, tableName, fieldName) {
    try {
      this.initializeApperClient()
      
      if (!this.apperClient) {
        throw new Error('ApperClient not available')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('fieldKey', fieldKey)
      formData.append('tableName', tableName)
      formData.append('fieldName', fieldName)

      // This would be the actual API call to Apper file service
      // For now, fall back to mock upload
      return await this.uploadFile(file)
      
    } catch (error) {
      console.error('Apper upload failed, falling back to mock:', error)
      return await this.uploadFile(file)
    }
  }

  // Delete file using ApperSDK
  async deleteFileWithApper(fileId, fieldKey) {
    try {
      this.initializeApperClient()
      
      if (!this.apperClient) {
        throw new Error('ApperClient not available')
      }

      // This would be the actual API call to delete file
      // For now, just remove from local storage
      this.removeUpload(fileId)
      return { success: true }
      
    } catch (error) {
      console.error('Apper delete failed:', error)
      return { success: false, error: error.message }
    }
  }

// Update files for a specific field
  async updateFieldFiles(fieldKey, files) {
    try {
      const convertedFiles = this.toUIFormat(files)
      
      // Store files by fieldKey for retrieval
      if (!this.fieldFiles) {
        this.fieldFiles = new Map()
      }
      if (!this.fieldFiles.has(fieldKey)) {
        this.fieldFiles.set(fieldKey, [])
      }
      this.fieldFiles.set(fieldKey, convertedFiles)
      
      return { success: true, data: convertedFiles }
      
    } catch (error) {
      console.error('Failed to update field files:', error)
      return { success: false, error: error.message }
    }
  }

  // Get files for a specific field
  async getFieldFiles(fieldKey) {
    try {
      // In a real implementation, this would fetch from the database
      // For now, return empty array
      return []
    } catch (error) {
      console.error('Failed to get field files:', error)
      return []
    }
  }

  // Clear all files for a specific field
  async clearFieldFiles(fieldKey) {
    try {
      // In a real implementation, this would clear files from database
      return { success: true }
    } catch (error) {
      console.error('Failed to clear field files:', error)
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService()