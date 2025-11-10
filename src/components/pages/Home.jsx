import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import DropZone from "@/components/organisms/DropZone"
import FileList from "@/components/organisms/FileList"
import ActionBar from "@/components/organisms/ActionBar"
import StatusMessage from "@/components/molecules/StatusMessage"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { useUploadService } from "@/hooks/useUploadService"
import { toast } from "react-toastify"

const Home = () => {
  const {
    files,
    isUploading,
    error,
    loading,
    addFiles,
    removeFile,
    uploadFile,
    uploadAll,
    clearCompleted,
    clearAll,
    retryUpload
  } = useUploadService()

  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(() => {
    if (error) {
      setStatusMessage({
        type: "error",
        message: error
      })
    }
  }, [error])

  const handleFilesSelected = (selectedFiles) => {
    addFiles(selectedFiles)
    setStatusMessage({
      type: "success", 
      message: `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} added successfully`
    })
  }

  const handleUploadAll = async () => {
    const result = await uploadAll()
    if (result.success) {
      setStatusMessage({
        type: "success",
        message: `${result.uploadedCount} file${result.uploadedCount > 1 ? 's' : ''} uploaded successfully`
      })
    }
  }

  const handleClearAll = () => {
    clearAll()
    setStatusMessage({
      type: "info",
      message: "All files cleared"
    })
  }

  const handleClearCompleted = () => {
    const completedCount = files.filter(f => f.status === "completed").length
    clearCompleted()
    if (completedCount > 0) {
      setStatusMessage({
        type: "info", 
        message: `${completedCount} completed file${completedCount > 1 ? 's' : ''} removed`
      })
    }
  }

  if (loading) return <Loading />
  if (error && files.length === 0) return <ErrorView />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              DropZone
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload and manage your files with ease
          </p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div className="mb-6">
              <StatusMessage
                type={statusMessage.type}
                message={statusMessage.message}
                onDismiss={() => setStatusMessage(null)}
                autoHide={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Zone */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <DropZone
            onFilesSelected={handleFilesSelected}
            isDisabled={isUploading}
            maxFiles={10}
            maxFileSize={10 * 1024 * 1024} // 10MB
          />
        </motion.div>

        {/* Action Bar */}
        <ActionBar
          files={files}
          onUploadAll={handleUploadAll}
          onClearAll={handleClearAll}
          onClearCompleted={handleClearCompleted}
          isUploading={isUploading}
          className="mb-6"
        />

        {/* File List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FileList
            files={files}
            onRemoveFile={removeFile}
            onRetryUpload={retryUpload}
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Files are simulated and stored locally. No actual uploads are performed.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Home