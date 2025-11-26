'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'

export default function EditCategoryPage({ params }) {
    const [categoryId, setCategoryId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        display_order: ''
    })
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter()
    const { success, error: showError } = useToast()

    const fetchCategoryData = async (id) => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setFormData(data)
        // Load existing image if it exists
        if (data.image) {
            setImages([data.image])
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params
            setCategoryId(id)
            fetchCategoryData(id)
        }
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase
            .from('categories')
            .update({
                name: formData.name,
                description: formData.description,
                display_order: formData.display_order,
                image: images[0] || null  // Save first image or null
            })
            .eq('id', categoryId)

        if (error) {
            setError(error.message)
            setLoading(false)
            showError('Error updating category: ' + error.message)
            return
        }

        success('Category updated successfully!')
        router.push('/admin/categories')
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Category</h1>
                    <p className="text-gray-600 mt-2">Update the category details and image</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8 text-gray-500">Loading category data...</p>
                )}

                {/* Form */}
                {!loading && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g., Engine Parts"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Category description..."
                            />
                        </div>

                        {/* Display Order Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="display_order"
                                value={formData.display_order}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="1, 2, 3..."
                            />
                            <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>

                        {/* Category Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Image
                            </label>
                            <ImageUpload 
                                images={images}
                                onImagesChange={setImages}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Upload one image that represents this category (recommended: 600x400px)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/categories')}
                                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
        </AdminProtection>
    )
}