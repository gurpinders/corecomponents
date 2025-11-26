'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import AdminProtection from '@/components/AdminProtection'
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminPartsPage(){
    const { success } = useToast()
    const { confirm } = useConfirm()
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    

    const fetchParts = async() => {
        const { data, error } = await supabase
            .from('parts')
            .select('*, categories(name)')
            .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setParts(data)
        setLoading(false)
    }

    const handleDelete = async (partId, partName) => {
        const confirmed = await confirm({
            title: 'Delete Part',
            message: `Are you sure you want to delete "${partName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        })
        
        if (!confirmed) return
        
        const { error: deleteError } = await supabase
            .from('parts')
            .delete()
            .eq('id', partId)
        
        if (deleteError) {
            error('Failed to delete part: ' + deleteError.message)
        } else {
            success('Part deleted successfully!')
            fetchParts()
        }
    }

    useEffect(() => {
        fetchParts();
    }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Manage Parts</h1>
                        <Link 
                            href="/admin/parts/new"
                            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
                        >
                            Add New Part
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <p className="text-center py-8">Loading parts...</p>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && parts.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                            No parts found. Add your first part!
                        </p>
                    )}

                    {/* Parts Table */}
                    {!loading && !error && parts.length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prices
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {parts.map((part) => (
                                        <tr key={part.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {part.images && part.images[0] ? (
                                                    <Image 
                                                        src={part.images[0]} 
                                                        alt={part.name}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{part.name}</div>
                                                {part.sku && (
                                                    <div className="text-sm text-gray-500">SKU: {part.sku}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {part.categories?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Retail: ${part.retail_price}</div>
                                                    <div className="text-green-600 font-medium">Customer: ${part.customer_price}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    part.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                                                    part.stock_status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {part.stock_status === 'in_stock' ? 'In Stock' :
                                                     part.stock_status === 'low_stock' ? 'Low Stock' :
                                                     'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/admin/parts/${part.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(part.id, part.name)}
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
                    )}
                </div>
            </main>
        </AdminProtection>
    )
}