'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"
import AdminProtection from "@/components/AdminProtection"
import { useToast } from '@/lib/ToastContext'
import { useConfirm } from '@/components/ConfirmDialog'

export default function AdminTrucksPage() {
    const [trucks, setTrucks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { success } = useToast()
    const { confirm } = useConfirm()

    const fetchTrucks = async () => {
        const { data, error } = await supabase.from('trucks').select('*').order('created_at', { ascending: false })
        if (error) { setError(error.message); setLoading(false); return }
        setTrucks(data)
        setLoading(false)
    }

    const handleDelete = async (truckId, truckName) => {
        const confirmed = await confirm({
            title: 'Delete Truck', message: `Are you sure you want to delete "${truckName}"? This action cannot be undone.`,
            confirmText: 'Delete', cancelText: 'Cancel', type: 'danger'
        })
        if (!confirmed) return
        const { error: deleteError } = await supabase.from('trucks').delete().eq('id', truckId)
        if (deleteError) { error('Failed to delete truck: ' + deleteError.message) }
        else { success('Truck deleted successfully!'); fetchTrucks() }
    }

    useEffect(() => { fetchTrucks() }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Trucks</h1>
                        <Link href="/admin/trucks/new" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-100 text-center w-full sm:w-auto transition-colors">
                            + Add New Truck
                        </Link>
                    </div>

                    {loading && <p className="text-center py-8 text-gray-400">Loading trucks...</p>}
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    {!loading && !error && trucks.length === 0 && <p className="text-center text-gray-400 py-8">No trucks found. Add your first truck!</p>}

                    {/* Desktop Table */}
                    {!loading && !error && trucks.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Image', 'Truck', 'Type', 'Prices', 'Status', 'Actions'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {trucks.map((truck) => (
                                            <tr key={truck.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {truck.images && truck.images[0] ? (
                                                        <Image src={truck.images[0]} alt={`${truck.year} ${truck.make} ${truck.model}`} width={48} height={48} className="h-12 w-12 rounded object-cover" />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-white/10 rounded"></div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-white">{`${truck.year} ${truck.make} ${truck.model}`}</div>
                                                    <div className="text-sm text-gray-400">{truck.mileage?.toLocaleString()} miles</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{truck.truck_category || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-400">Retail: ${truck.retail_price?.toLocaleString() || '0'}</div>
                                                    <div className="text-sm text-green-400 font-medium">Member: ${truck.customer_price?.toLocaleString() || '0'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        truck.status === 'available' ? 'bg-green-900/50 text-green-400' :
                                                        truck.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                        'bg-red-900/50 text-red-400'
                                                    }`}>
                                                        {truck.status === 'available' ? 'Available' : truck.status === 'pending' ? 'Pending' : 'Sold'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link href={`/admin/trucks/${truck.id}/edit`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                                                    <button onClick={() => handleDelete(truck.id, `${truck.year} ${truck.make} ${truck.model}`)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && trucks.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {trucks.map((truck) => (
                                <div key={truck.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-start gap-4 mb-4">
                                        {truck.images && truck.images[0] ? (
                                            <Image src={truck.images[0]} alt={`${truck.year} ${truck.make} ${truck.model}`} width={80} height={80} className="h-20 w-20 rounded object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="h-20 w-20 bg-white/10 rounded flex-shrink-0"></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg mb-1 break-words">{`${truck.year} ${truck.make} ${truck.model}`}</h3>
                                            <p className="text-sm text-gray-400">{truck.mileage?.toLocaleString()} miles</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 border-t border-white/10 pt-3">
                                        {[
                                            { label: 'Type', value: truck.truck_category || 'N/A' },
                                            { label: 'Retail Price', value: `$${truck.retail_price?.toLocaleString() || '0'}` },
                                            { label: 'Member Price', value: `$${truck.customer_price?.toLocaleString() || '0'}`, green: true },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-400">{item.label}:</span>
                                                <span className={`text-sm ${item.green ? 'text-green-400 font-semibold' : 'text-white'}`}>{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Status:</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                truck.status === 'available' ? 'bg-green-900/50 text-green-400' :
                                                truck.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                            }`}>
                                                {truck.status === 'available' ? 'Available' : truck.status === 'pending' ? 'Pending' : 'Sold'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                                        <Link href={`/admin/trucks/${truck.id}/edit`} className="flex-1 bg-white text-black text-center py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">Edit</Link>
                                        <button onClick={() => handleDelete(truck.id, `${truck.year} ${truck.make} ${truck.model}`)} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg font-medium hover:bg-red-900/70 transition-colors">Delete</button>
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