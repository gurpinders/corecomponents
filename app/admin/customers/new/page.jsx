'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function AddCustomerPage() {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subscribed: false })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(null)
        const { error } = await supabase.from('customers').insert([formData])
        if (error) { setError(error.message); setLoading(false); return }
        router.push('/admin/customers')
    }

    const inputClass = "w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
    const labelClass = "block text-sm font-medium text-gray-400 mb-2"

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Add New Customer</h1>
                        <p className="text-gray-400 mt-2">Fill in the customer details</p>
                    </div>
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                        <div><label className={labelClass}>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Customer name" className={inputClass} /></div>
                        <div><label className={labelClass}>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="customer@example.com" className={inputClass} /></div>
                        <div><label className={labelClass}>Company</label><input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" className={inputClass} /></div>
                        <div><label className={labelClass}>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(123) 456-7890" className={inputClass} /></div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="subscribed" checked={formData.subscribed} onChange={handleChange} className="h-4 w-4 rounded" />
                            <label className="text-sm text-gray-400">Subscribe to email marketing</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 transition-colors">
                                {loading ? 'Adding...' : 'Add Customer'}
                            </button>
                            <button type="button" onClick={() => router.push('/admin/customers')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            </main>
        </AdminProtection>
    )
}