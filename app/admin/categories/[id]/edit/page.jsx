'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'

export default function EditCategoryPage({ params }) {
    const [categoryId, setCategoryId] = useState(null)
    const [formData, setFormData] = useState({ name: '', description: '', display_order: '' })
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    const fetchCategoryData = async (id) => {
        const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()
        if (error) { setError(error.message); setLoading(false); return }
        setFormData(data)
        if (data.image) setImages([data.image])
        setLoading(false)
    }

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params
            setCategoryId(id)
            fetchCategoryData(id)
        }
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(null)
        const { error } = await supabase.from('categories').update({ name: formData.name, description: formData.description, display_order: formData.display_order, image: images[0] || null }).eq('id', categoryId)
        if (error) { setError(error.message); setLoading(false); showError('Error updating category: ' + error.message); return }
        success('Category updated successfully!')
        router.push('/admin/categories')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Edit Category</h1>
                        <p className="text-gray-400 mt-2">Update the category details and image</p>
                    </div>
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    {loading && <p className="text-center py-8 text-gray-400">Loading category data...</p>}
                    {!loading && (
                        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                            <div><label className={labelClass}>Category Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} /></div>
                            <div><label className={labelClass}>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass} /></div>
                            <div>
                                <label className={labelClass}>Display Order</label>
                                <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className={inputClass} />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>
                            <div>
                                <label className={labelClass}>Category Image</label>
                                <ImageUpload images={images} onImagesChange={setImages} />
                                <p className="text-xs text-gray-500 mt-2">Recommended: 600x400px</p>
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                    {loading ? 'Updating...' : 'Update Category'}
                                </button>
                                <button type="button" onClick={() => router.push('/admin/categories')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </AdminProtection>
    )
}