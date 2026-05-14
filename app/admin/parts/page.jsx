'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminPartsPage() {
    const { success } = useToast()
    const { confirm } = useConfirm()
    const [parts, setParts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchParts = async () => {
        const { data, error } = await supabase
            .from('parts').select('*, categories(name)').order('created_at', { ascending: false })
        if (error) { setError(error.message); setLoading(false); return }
        setParts(data)
        setLoading(false)
    }

    const handleDelete = async (partId, partName) => {
        const confirmed = await confirm({
            title: 'Delete Part',
            message: `Are you sure you want to delete "${partName}"? This action cannot be undone.`,
            confirmText: 'Delete', cancelText: 'Cancel', type: 'danger'
        })
        if (!confirmed) return
        const { error: deleteError } = await supabase.from('parts').delete().eq('id', partId)
        if (deleteError) { error('Failed to delete part: ' + deleteError.message) }
        else { success('Part deleted successfully!'); fetchParts() }
    }

    useEffect(() => { fetchParts() }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Parts</h1>
                        <Link href="/admin/parts/new" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-100 text-center w-full sm:w-auto transition-colors">
                            + Add New Part
                        </Link>
                    </div>

                    {loading && <p className="text-center py-8 text-gray-400">Loading parts...</p>}

                    {error && (
                        <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && parts.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No parts found. Add your first part!</p>
                    )}

                    {/* Desktop Table */}
                    {!loading && !error && parts.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Image', 'Name', 'Category', 'Prices', 'Stock', 'Actions'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {parts.map((part) => (
                                            <tr key={part.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {part.images && part.images[0] ? (
                                                        <Image src={part.images[0]} alt={part.name} width={48} height={48} className="h-12 w-12 rounded object-cover" />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-white/10 rounded"></div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-white">{part.name}</div>
                                                    {part.sku && <div className="text-sm text-gray-400">SKU: {part.sku}</div>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {part.categories?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-400">Retail: ${part.retail_price}</div>
                                                    <div className="text-sm text-green-400 font-medium">Member: ${part.customer_price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        part.stock_status === 'in_stock' ? 'bg-green-900/50 text-green-400' :
                                                        part.stock_status === 'low_stock' ? 'bg-yellow-900/50 text-yellow-400' :
                                                        'bg-red-900/50 text-red-400'
                                                    }`}>
                                                        {part.stock_status === 'in_stock' ? 'In Stock' : part.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link href={`/admin/parts/${part.id}/edit`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                                                    <button onClick={() => handleDelete(part.id, part.name)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && parts.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {parts.map((part) => (
                                <div key={part.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-start gap-4 mb-4">
                                        {part.images && part.images[0] ? (
                                            <Image src={part.images[0]} alt={part.name} width={80} height={80} className="h-20 w-20 rounded object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="h-20 w-20 bg-white/10 rounded flex-shrink-0"></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg mb-1 break-words">{part.name}</h3>
                                            {part.sku && <p className="text-sm text-gray-400">SKU: {part.sku}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-3 border-t border-white/10 pt-3">
                                        {[
                                            { label: 'Category', value: part.categories?.name || 'N/A' },
                                            { label: 'Retail Price', value: `$${part.retail_price}` },
                                            { label: 'Member Price', value: `$${part.customer_price}`, green: true },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-400">{item.label}:</span>
                                                <span className={`text-sm ${item.green ? 'text-green-400 font-semibold' : 'text-white'}`}>{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Stock:</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                part.stock_status === 'in_stock' ? 'bg-green-900/50 text-green-400' :
                                                part.stock_status === 'low_stock' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                            }`}>
                                                {part.stock_status === 'in_stock' ? 'In Stock' : part.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                                        <Link href={`/admin/parts/${part.id}/edit`} className="flex-1 bg-white text-black text-center py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">Edit</Link>
                                        <button onClick={() => handleDelete(part.id, part.name)} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg font-medium hover:bg-red-900/70 transition-colors">Delete</button>
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