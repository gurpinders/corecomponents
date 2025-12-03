'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import AdminProtection from "@/components/AdminProtection"


export default function AdminCustomersPage(){
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]= useState(null)

    const router = useRouter();

    const fetchCustomers = async() => {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setCustomers(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCustomers();
    }, [])

    const handleDelete = async (customerId) => {
        if (!confirm('Are you sure you want to delete this customer?')) return
        
        const { error } = await supabase.from('customers').delete().eq('id', customerId)
        
        if (error) {
            alert('Error deleting customer: ' + error.message)
        } else {
            fetchCustomers()
        }
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Customers</h1>
                    <Link 
                        href="/admin/customers/new"
                        className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-800 text-center w-full sm:w-auto"
                    >
                        Add New Customer
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8 text-gray-500">Loading customers...</p>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && customers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No customers yet. Add your first customer!
                    </p>
                )}

                {/* DESKTOP: Customers Table */}
                {!loading && !error && customers.length > 0 && (
                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subscribed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{customer.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.company || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    customer.subscribed 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {customer.subscribed ? '✓ Yes' : '✗ No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/admin/customers/${customer.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
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

                {/* MOBILE: Customers Cards */}
                {!loading && !error && customers.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {customers.map((customer) => (
                            <div key={customer.id} className="bg-white rounded-lg shadow p-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-3">{customer.name || 'N/A'}</h3>

                                <div className="space-y-3 border-t pt-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-gray-600">Email:</span>
                                        <span className="text-sm text-gray-900 text-right break-all">{customer.email}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Company:</span>
                                        <span className="text-sm text-gray-900">{customer.company || 'N/A'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                                        <span className="text-sm text-gray-900">{customer.phone || 'N/A'}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Email Subscribed:</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            customer.subscribed 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.subscribed ? '✓ Yes' : '✗ No'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t">
                                    <Link
                                        href={`/admin/customers/${customer.id}/edit`}
                                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
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