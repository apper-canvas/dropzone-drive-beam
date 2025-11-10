import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { cn } from '@/utils/cn'

const ApperFileFieldComponent = ({ 
  elementId, 
  config = {}, 
  className = '', 
  style = {} 
}) => {
  // Refs
  const elementIdRef = useRef(null)
  const mountedRef = useRef(false)
  const sdkLoadAttemptsRef = useRef(0)
  
  // State
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)

  // Memoize existing files to prevent unnecessary re-renders
  const existingFiles = useMemo(() => {
    try {
      if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
        return []
      }
      
      // Convert to UI format if needed
      if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
        return window.ApperSDK.ApperFileUploader.toUIFormat(config.existingFiles)
      }
      
      return config.existingFiles
    } catch (err) {
      console.error('Error processing existing files:', err)
      return []
    }
  }, [config.existingFiles])

  // Check SDK availability with retry mechanism
  const checkSDKAvailability = useCallback(async () => {
    const maxAttempts = 50
    const waitTime = 100 // 100ms per attempt = 5 seconds total
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        sdkLoadAttemptsRef.current++
        
        if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
          clearInterval(checkInterval)
          setSdkLoaded(true)
          resolve(true)
          return
        }
        
        if (sdkLoadAttemptsRef.current >= maxAttempts) {
          clearInterval(checkInterval)
          resolve(false)
          return
        }
      }, waitTime)
    })
  }, [])

  // Mount the file field component
  const mountFileField = useCallback(async () => {
    if (!elementIdRef.current || mountedRef.current || !sdkLoaded) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.')
      }

      const { ApperFileUploader } = window.ApperSDK
      
      if (!ApperFileUploader || !ApperFileUploader.FileField) {
        throw new Error('ApperFileUploader.FileField not available in SDK')
      }

      // Validate required config
      if (!config.fieldKey) {
        throw new Error('fieldKey is required in config')
      }

      if (!config.apperProjectId || !config.apperPublicKey) {
        throw new Error('apperProjectId and apperPublicKey are required in config')
      }

      // Mount the file field
      const mounted = await ApperFileUploader.FileField.mount(elementIdRef.current, {
        ...config,
        // Use memoized existingFiles
        existingFiles: existingFiles
      })

      if (mounted) {
        mountedRef.current = true
        setIsReady(true)
        setError(null)
        toast.success('File uploader ready')
      } else {
        throw new Error('Failed to mount file field')
      }

    } catch (err) {
      console.error('Failed to mount ApperFileField:', err)
      if (mountedRef.current === false) { // Only set error if component is still mounted
        setError(err.message)
        setIsReady(false)
        toast.error(`File uploader error: ${err.message}`)
      }
    } finally {
      if (mountedRef.current !== null) { // Only update loading if component is still mounted
        setIsLoading(false)
      }
    }
  }, [config, existingFiles, sdkLoaded])

  // Unmount the file field component
  const unmountFileField = useCallback(() => {
    if (!mountedRef.current || !elementIdRef.current) {
      return
    }

    try {
      if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
        window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current)
      }
    } catch (err) {
      console.error('Error during unmount:', err)
    } finally {
      mountedRef.current = false
      setIsReady(false)
    }
  }, [])

  // Update files programmatically
  const updateFiles = useCallback(async (filesToUpdate) => {
    if (!config.fieldKey || !mountedRef.current) {
      console.warn('Cannot update files: component not ready or fieldKey missing')
      return
    }

    try {
      if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
        await window.ApperSDK.ApperFileUploader.FileField.updateFiles(
          config.fieldKey, 
          filesToUpdate
        )
        toast.success('Files updated successfully')
      }
    } catch (err) {
      console.error('Failed to update files:', err)
      toast.error(`Failed to update files: ${err.message}`)
    }
  }, [config.fieldKey])

  // Clear all files
  const clearField = useCallback(async () => {
    if (!config.fieldKey || !mountedRef.current) {
      console.warn('Cannot clear field: component not ready or fieldKey missing')
      return
    }

    try {
      if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
        await window.ApperSDK.ApperFileUploader.FileField.clearField(config.fieldKey)
        toast.success('Files cleared successfully')
      }
    } catch (err) {
      console.error('Failed to clear field:', err)
      toast.error(`Failed to clear files: ${err.message}`)
    }
  }, [config.fieldKey])

  // Initialize SDK and mount component
  useEffect(() => {
    let mounted = true

    const initializeComponent = async () => {
      try {
        const sdkAvailable = await checkSDKAvailability()
        
        if (!mounted) return

        if (!sdkAvailable) {
          setError('ApperSDK failed to load after maximum retry attempts')
          setIsLoading(false)
          toast.error('File uploader failed to initialize')
          return
        }

        if (mounted) {
          await mountFileField()
        }
      } catch (err) {
        if (mounted) {
          console.error('Component initialization error:', err)
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    initializeComponent()

    return () => {
      mounted = false
    }
  }, [checkSDKAvailability, mountFileField])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unmountFileField()
    }
  }, [unmountFileField])

  // Update elementId ref when elementId prop changes
  useEffect(() => {
    if (elementId && elementIdRef.current !== elementId) {
      elementIdRef.current = elementId
    }
  }, [elementId])

  // Expose methods for parent components
  React.useImperativeHandle(React.forwardRef().ref, () => ({
    updateFiles,
    clearField,
    isReady,
    isLoading,
    error
  }), [updateFiles, clearField, isReady, isLoading, error])

  // Render loading state
  if (isLoading) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50",
          className
        )}
        style={style}
      >
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-600">Initializing file uploader...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50",
          className
        )}
        style={style}
      >
        <div className="text-center space-y-3">
          <div className="h-8 w-8 text-red-500 mx-auto">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Main render - container for SDK to mount into
  return (
    <div 
      id={elementId}
      ref={(el) => { elementIdRef.current = el }}
      className={cn(
        "w-full min-h-[200px] rounded-lg border-2 border-dashed border-gray-300",
        isReady ? "border-blue-300 bg-blue-50" : "border-gray-300 bg-gray-50",
        className
      )}
      style={style}
    >
      {/* Fallback content while SDK mounts */}
      {!isReady && (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center space-y-3">
            <div className="animate-pulse h-8 w-8 bg-gray-300 rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500">Loading file uploader interface...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApperFileFieldComponent