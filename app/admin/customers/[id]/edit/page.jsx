'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function EditCustomerPage({ params }) {
    const [customerId, setCustomerId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        subscribed: false
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const router = useRouter()

    const fetchCustomerData = async (id) => {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setFormData(data)
        setLoading(false)
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
            const { id } = await params
            setCustomerId(id)
            fetchCustomerData(id)
        }
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase
            .from('customers')
            .update(formData)
            .eq('id', customerId)

        if (error) {
            setError(error.message)
            setLoading(false)
            alert('Error updating customer: ' + error.message)
            return
        }

        router.push('/admin/customers')
    }

    return (
        <AdminProtection>
            <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Customer</h1>
                    <p className="text-gray-600 mt-2">Update the customer details</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <p className="text-center py-8 text-gray-500">Loading customer data...</p>
                )}

                {/* Form */}
                {!loading && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Customer name"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="customer@example.com"
                            />
                        </div>

                        {/* Company Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Company name"
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="(123) 456-7890"
                            />
                        </div>

                        {/* Subscribed Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="subscribed"
                                checked={formData.subscribed}
                                onChange={handleChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Subscribe to email marketing
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Customer'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/customers')}
                                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
        </AdminProtection>
    )
}