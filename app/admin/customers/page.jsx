'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import AdminProtection from "@/components/AdminProtection"

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCustomers = async () => {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
        if (error) { setError(error.message); setLoading(false); return }
        setCustomers(data)
        setLoading(false)
    }

    const handleDelete = async (customerId) => {
        if (!confirm('Are you sure you want to delete this customer?')) return
        const { error } = await supabase.from('customers').delete().eq('id', customerId)
        if (error) { alert('Error deleting customer: ' + error.message) } else { fetchCustomers() }
    }

    useEffect(() => { fetchCustomers() }, [])

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Customers</h1>
                        <Link href="/admin/customers/new" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-100 text-center w-full sm:w-auto transition-colors">
                            + Add New Customer
                        </Link>
                    </div>

                    {loading && <p className="text-center py-8 text-gray-400">Loading customers...</p>}
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    {!loading && !error && customers.length === 0 && <p className="text-center text-gray-400 py-8">No customers yet.</p>}

                    {/* Desktop Table */}
                    {!loading && !error && customers.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Name', 'Email', 'Company', 'Phone', 'Subscribed', 'Actions'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{customer.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{customer.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{customer.company || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{customer.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.subscribed ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                                                        {customer.subscribed ? '✓ Yes' : '✗ No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link href={`/admin/customers/${customer.id}/edit`} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">Edit</Link>
                                                    <button onClick={() => handleDelete(customer.id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && customers.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {customers.map((customer) => (
                                <div key={customer.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <h3 className="font-bold text-white text-lg mb-3">{customer.name || 'N/A'}</h3>
                                    <div className="space-y-3 border-t border-white/10 pt-3">
                                        {[
                                            { label: 'Email', value: customer.email },
                                            { label: 'Company', value: customer.company || 'N/A' },
                                            { label: 'Phone', value: customer.phone || 'N/A' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-sm font-medium text-gray-400">{item.label}:</span>
                                                <span className="text-sm text-white text-right break-all">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-400">Subscribed:</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.subscribed ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                                                {customer.subscribed ? '✓ Yes' : '✗ No'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                                        <Link href={`/admin/customers/${customer.id}/edit`} className="flex-1 bg-white text-black text-center py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">Edit</Link>
                                        <button onClick={() => handleDelete(customer.id)} className="flex-1 bg-red-900/50 text-red-400 py-2 rounded-lg font-medium hover:bg-red-900/70 transition-colors">Delete</button>
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