'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import AdminProtection from "@/components/AdminProtection";
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminTrucksPage(){
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { success } = useToast()
    const { confirm } = useConfirm()

    const fetchTrucks = async() => {
        const { data, error } = await supabase
            .from('trucks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setTrucks(data)
        setLoading(false)
    }

    const handleDelete = async (truckId, truckName) => {
        const confirmed = await confirm({
            title: 'Delete Truck',
            message: `Are you sure you want to delete "${truckName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        })
        
        if (!confirmed) return
        
        const { error: deleteError } = await supabase.from('trucks').delete().eq('id', truckId)
        
        if (deleteError) {
            error('Failed to delete truck: ' + deleteError.message)
        } else {
            success('Truck deleted successfully!')
            fetchTrucks()
        }
    }

    useEffect(() => {
        fetchTrucks();
    }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Trucks</h1>
                    <Link 
                        href="/admin/trucks/new"
                        className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-800 text-center w-full sm:w-auto"
                    >
                        Add New Truck
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8">Loading trucks...</p>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && trucks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No trucks found. Add your first truck!
                    </p>
                )}

                {/* DESKTOP: Trucks Table */}
                {!loading && !error && trucks.length > 0 && (
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Truck
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prices
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trucks.map((truck) => (
                                        <tr key={truck.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {truck.images && truck.images[0] ? (
                                                    <Image 
                                                        src={truck.images[0]} 
                                                        alt={`${truck.year} ${truck.make} ${truck.model}`}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{`${truck.year} ${truck.make} ${truck.model}`}</div>
                                                <div className="text-sm text-gray-500">{truck.mileage?.toLocaleString()} miles</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {truck.truck_category || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Retail: ${truck.retail_price?.toLocaleString() || '0'}</div>
                                                    <div className="text-green-600 font-medium">Customer: ${truck.customer_price?.toLocaleString() || '0'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    truck.status === 'available' ? 'bg-green-100 text-green-800' :
                                                    truck.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {truck.status === 'available' ? 'Available' :
                                                     truck.status === 'pending' ? 'Pending' :
                                                     'Sold'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/admin/trucks/${truck.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(truck.id, `${truck.year} ${truck.make} ${truck.model}`)}
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

                {/* MOBILE: Trucks Cards */}
                {!loading && !error && trucks.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {trucks.map((truck) => (
                            <div key={truck.id} className="bg-white rounded-lg shadow p-4">
                                {/* Truck Image and Name */}
                                <div className="flex items-start gap-4 mb-4">
                                    {truck.images && truck.images[0] ? (
                                        <Image 
                                            src={truck.images[0]} 
                                            alt={`${truck.year} ${truck.make} ${truck.model}`}
                                            width={80}
                                            height={80}
                                            className="h-20 w-20 rounded object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-200 rounded flex-shrink-0"></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1 break-words">
                                            {`${truck.year} ${truck.make} ${truck.model}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">{truck.mileage?.toLocaleString()} miles</p>
                                    </div>
                                </div>

                                {/* Truck Details */}
                                <div className="space-y-3 border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Type:</span>
                                        <span className="text-sm text-gray-900">{truck.truck_category || 'N/A'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Retail Price:</span>
                                        <span className="text-sm text-gray-900">${truck.retail_price?.toLocaleString() || '0'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Customer Price:</span>
                                        <span className="text-sm font-semibold text-green-600">${truck.customer_price?.toLocaleString() || '0'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            truck.status === 'available' ? 'bg-green-100 text-green-800' :
                                            truck.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {truck.status === 'available' ? 'Available' :
                                             truck.status === 'pending' ? 'Pending' :
                                             'Sold'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                    <Link
                                        href={`/admin/trucks/${truck.id}/edit`}
                                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(truck.id, `${truck.year} ${truck.make} ${truck.model}`)}
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