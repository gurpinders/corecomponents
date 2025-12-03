'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter()
    const { success } = useToast()
    const { confirm } = useConfirm()

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setCategories(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleDelete = async (categoryId, categoryName) => {
        const confirmed = await confirm({
            title: 'Delete Category',
            message: `Are you sure you want to delete "${categoryName}"? This will not delete parts in this category.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        })
        
        if (!confirmed) return
        
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId)
        
        if (deleteError) {
            error('Failed to delete category: ' + deleteError.message)
        } else {
            success('Category deleted successfully!')
            fetchCategories()
        }
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Categories</h1>
                    <Link 
                        href="/admin/categories/new"
                        className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-800 text-center w-full sm:w-auto"
                    >
                        Add New Category
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8 text-gray-500">Loading categories...</p>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && categories.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No categories yet. Add your first category!
                    </p>
                )}

                {/* DESKTOP: Categories Table */}
                {!loading && !error && categories.length > 0 && (
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Display Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {category.display_order}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="max-w-xs truncate">
                                                    {category.description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MOBILE: Categories Cards */}
                {!loading && !error && categories.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-900 text-lg flex-1">{category.name}</h3>
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-semibold ml-2">
                                        #{category.display_order}
                                    </span>
                                </div>

                                <div className="space-y-3 border-t pt-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 block mb-1">Description:</span>
                                        <p className="text-sm text-gray-900">{category.description || 'No description'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
        </AdminProtection>
    )
}