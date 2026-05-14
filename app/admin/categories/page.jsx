'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { success } = useToast()
    const { confirm } = useConfirm()

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true })
        if (error) { setError(error.message); setLoading(false); return }
        setCategories(data)
        setLoading(false)
    }

    const handleDelete = async (categoryId, categoryName) => {
        const confirmed = await confirm({ title: 'Delete Category', message: `Are you sure you want to delete "${categoryName}"?`, confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' })
        if (!confirmed) return
        const { error: deleteError } = await supabase.from('categories').delete().eq('id', categoryId)
        if (deleteError) { error('Failed to delete: ' + deleteError.message) }
        else { success('Category deleted!'); fetchCategories() }
    }

    useEffect(() => { fetchCategories() }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Categories</h1>
                        <Link href="/admin/categories/new" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-100 text-center w-full sm:w-auto transition-colors">
                            + Add New Category
                        </Link>
                    </div>

                    {loading && <p className="text-center py-8 text-gray-400">Loading categories...</p>}
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    {!loading && !error && categories.length === 0 && <p className="text-center text-gray-400 py-8">No categories yet.</p>}

                    {/* Desktop Table */}
                    {!loading && !error && categories.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Order', 'Name', 'Description', 'Actions'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{category.display_order}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{category.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400"><div className="max-w-xs truncate">{category.description || 'No description'}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                                                    <button onClick={() => handleDelete(category.id, category.name)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && categories.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {categories.map((category) => (
                                <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-white text-lg flex-1">{category.name}</h3>
                                        <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-sm font-semibold ml-2">#{category.display_order}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3">
                                        <p className="text-sm text-gray-400">{category.description || 'No description'}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                                        <Link href={`/admin/categories/${category.id}/edit`} className="flex-1 bg-white text-black text-center py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">Edit</Link>
                                        <button onClick={() => handleDelete(category.id, category.name)} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg font-medium hover:bg-red-900/70 transition-colors">Delete</button>
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