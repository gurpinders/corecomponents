'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUpload from '@/components/ImageUpload'

export default function EditPartPage({ params }){
    const [partId, setPartId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        retail_price: '',
        category_id: '',
        stock_status: 'in_stock',
        featured: false,
        images: ['']
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    const fetchPartData = async (id) => {
        const { data, error } = await supabase.from('parts').select('*').eq('id', id).single();
        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        } 
        setFormData(data);
        setImages(data.images || []);
        setLoading(false);
    }

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('display_order')
        if (data){
            setCategories(data);
        }  
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params;
            setPartId(id)
            fetchPartData(id)
            fetchCategories()
        }
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase
        .from('parts')
        .update({
            name: formData.name,
            description: formData.description,
            retail_price: parseFloat(formData.retail_price),
            customer_price: (parseFloat(formData.retail_price) * 0.95).toFixed(2),
            category_id: formData.category_id,
            stock_status: formData.stock_status,
            featured: formData.featured,
            images: images
        })
        .eq('id', partId)

        if (error) {
            setError(error.message)
            setLoading(false)
            alert('Error editing part: ' + error.message)
            return
        }

        // Success - redirect to parts list
        router.push('/admin/parts')
    }

    return(
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl font-bold">Edit Part</h1>
                <p>Update the details for this part</p>
                {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
                )}
                {loading && (
                    <p className="text-center py-8">Loading parts...</p>
                )}

                {!loading && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g., Heavy Duty Oil Filter"
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
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Product description..."
                        />
                    </div>

                    {/* Price Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            type="number"
                            name="retail_price"
                            value={formData.retail_price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stock Status Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Status *
                        </label>
                        <select
                            name="stock_status"
                            value={formData.stock_status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <ImageUpload 
                    images={images}
                    onImagesChange={setImages}
                    />

                    {/* Featured Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Feature this product on the homepage
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Part'} 
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/parts')}
                            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                )}
            </div>

            
        </main>
    )
}