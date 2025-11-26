'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function ImageUpload({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Handle file selection and upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError('Only JPG, PNG, and WebP images are allowed')
      return
    }

    // Validate file sizes (max 5MB per file)
    const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (largeFiles.length > 0) {
      setError('Each image must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadedUrls = []

      for (const file of files) {
        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      // Add new URLs to existing images
      onImagesChange([...images, ...uploadedUrls])
      
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Remove an image
  const handleRemoveImage = async (urlToRemove, index) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove this image?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      // Extract filename from URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/filename.jpg
      const urlParts = urlToRemove.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([fileName])

      if (deleteError) {
        console.error('Storage delete error:', deleteError)
        // Continue anyway - the file might already be deleted
      }

      // Remove from state (always do this even if storage delete fails)
      const newImages = images.filter(url => url !== urlToRemove)
      onImagesChange(newImages)
      
      // Show success message
      setError(null)
      alert('Image removed successfully!')
      
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to remove image. Try again or refresh the page.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Product Images
        </label>
        
        {/* Upload Button */}
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm border border-gray-300 rounded-lg p-2 cursor-pointer"
        />
        
        <p className="text-xs text-gray-500 mt-1">
          Upload multiple images (JPG, PNG, WebP). Max 5MB each.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="text-blue-600 font-medium">
          Uploading images...
        </div>
      )}

      {/* Image Previews */}
      {images.filter(url => url && url.trim() !== '').length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images
            .filter(url => url && url.trim() !== '')
            .map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Remove Button - Always visible on mobile, hover on desktop */}
              <button
                type="button"
                onClick={() => handleRemoveImage(url, index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors md:opacity-0 md:group-hover:opacity-100"
                title="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image number badge */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}