'use client'

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ImageUpload from '@/components/ImageUpload'
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'

export default function AddPartPage() {
    const [formData, setFormData] = useState({
        name: '', description: '', retail_price: '',
        category_id: '', stock_status: 'in_stock', featured: false
    })
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { success, error: showError } = useToast()

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').order('display_order')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.from('parts').insert([{
            name: formData.name, description: formData.description,
            retail_price: parseFloat(formData.retail_price),
            customer_price: (parseFloat(formData.retail_price) * 0.95).toFixed(2),
            category_id: formData.category_id, stock_status: formData.stock_status,
            featured: formData.featured, images: images
        }])
        if (error) { setError(error.message); setLoading(false); showError('Error creating part: ' + error.message); return }
        success('Part created successfully!')
        router.push('/admin/parts')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Add New Part</h1>
                        <p className="text-gray-400 mt-2">Fill in the details to add a new part to your catalog</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
                            Error: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                        <div>
                            <label className={labelClass}>Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Heavy Duty Oil Filter" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Product description..." className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Retail Price *</label>
                            <input type="number" name="retail_price" value={formData.retail_price} onChange={handleChange} required step="0.01" min="0" placeholder="0.00" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Category *</label>
                            <select name="category_id" value={formData.category_id} onChange={handleChange} required className={inputClass}>
                                <option value="">Select a category</option>
                                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Stock Status *</label>
                            <select name="stock_status" value={formData.stock_status} onChange={handleChange} required className={inputClass}>
                                <option value="in_stock">In Stock</option>
                                <option value="low_stock">Low Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                        <ImageUpload images={images} onImagesChange={setImages} />
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded" />
                            <label className="text-sm text-gray-400">Feature this product on the homepage</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                {loading ? 'Adding...' : 'Add Part'}
                            </button>
                            <button type="button" onClick={() => router.push('/admin/parts')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AdminProtection>
    )
}