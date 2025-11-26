'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import AdminProtection from "@/components/AdminProtection";

export default function AdminTrucksPage(){
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

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
        const confirmed = window.confirm(
            `Are you sure you want to delete "${truckName}"?\n\nThis action cannot be undone.`
        )
        
        if (!confirmed) return
        
        const { error } = await supabase.from('trucks').delete().eq('id', truckId)
        
        if (error) {
            alert('Error deleting truck: ' + error.message)
        } else {
            alert('Truck deleted successfully!')
            fetchTrucks() // Refresh the list
        }
    }

    useEffect(() => {
        fetchTrucks();
    }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Trucks</h1>
                    <Link 
                        href="/admin/trucks/new"
                        className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
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

                {/* Trucks Table */}
                {!loading && !error && trucks.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                )}
            </div>
        </main>
        </AdminProtection>
    )
}