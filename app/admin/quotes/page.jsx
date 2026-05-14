'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import AdminProtection from "@/components/AdminProtection"

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchQuotes = async () => {
        const { data, error } = await supabase.from('quote_requests').select('*, parts(name)').order('created_at', { ascending: false })
        if (error) { setError(error.message); setLoading(false); return }
        setQuotes(data)
        setLoading(false)
    }

    const handleStatusUpdate = async (quoteId, newStatus) => {
        const { error } = await supabase.from('quote_requests').update({ status: newStatus }).eq('id', quoteId)
        if (error) { alert('Error updating status: ' + error.message); return }
        fetchQuotes()
    }

    useEffect(() => { fetchQuotes() }, [])

    const statusSelectClass = (status) => {
        const base = "text-xs font-semibold rounded-full px-3 py-1 border-0 focus:outline-none bg-transparent "
        if (status === 'new') return base + 'text-blue-400'
        if (status === 'contacted') return base + 'text-yellow-400'
        if (status === 'quoted') return base + 'text-purple-400'
        return base + 'text-gray-400'
    }

    return (
        <AdminProtection>
            <main className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">Quote Requests</h1>

                    {loading && <p className="text-center py-8 text-gray-400">Loading quotes...</p>}
                    {error && <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">Error: {error}</div>}
                    {!loading && !error && quotes.length === 0 && <p className="text-center text-gray-400 py-8">No quote requests yet.</p>}

                    {/* Desktop Table */}
                    {!loading && !error && quotes.length > 0 && (
                        <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            {['Date', 'Customer', 'Part', 'Quantity', 'Message', 'Status'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {quotes.map((quote) => (
                                            <tr key={quote.id} className="hover:bg-white/5">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(quote.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="font-medium text-white">{quote.customer_name}</div>
                                                        <div className="text-gray-400">{quote.customer_email}</div>
                                                        {quote.customer_company && <div className="text-gray-400">{quote.customer_company}</div>}
                                                        {quote.customer_phone && <div className="text-gray-400">{quote.customer_phone}</div>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{quote.parts?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{quote.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400"><div className="max-w-xs truncate">{quote.message || 'No message'}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={quote.status}
                                                        onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold focus:outline-none border border-white/20 bg-black ${
                                                            quote.status === 'new' ? 'text-blue-400' :
                                                            quote.status === 'contacted' ? 'text-yellow-400' :
                                                            quote.status === 'quoted' ? 'text-purple-400' :
                                                            'text-gray-400'
                                                        }`}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="quoted">Quoted</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {!loading && !error && quotes.length > 0 && (
                        <div className="md:hidden space-y-4">
                            {quotes.map((quote) => (
                                <div key={quote.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-white text-lg">{quote.customer_name}</h3>
                                        <span className="text-xs text-gray-400">{new Date(quote.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="space-y-3 border-t border-white/10 pt-3">
                                        {[
                                            { label: 'Email', value: quote.customer_email },
                                            quote.customer_company && { label: 'Company', value: quote.customer_company },
                                            quote.customer_phone && { label: 'Phone', value: quote.customer_phone },
                                            { label: 'Part', value: quote.parts?.name || 'N/A' },
                                            { label: 'Quantity', value: quote.quantity },
                                        ].filter(Boolean).map((item) => (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-sm font-medium text-gray-400">{item.label}:</span>
                                                <span className="text-sm text-white text-right">{item.value}</span>
                                            </div>
                                        ))}
                                        {quote.message && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-400 block mb-1">Message:</span>
                                                <p className="text-sm text-white bg-white/5 p-2 rounded">{quote.message}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-sm font-medium text-gray-400 block mb-2">Status:</span>
                                            <select
                                                value={quote.status}
                                                onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                                                className="w-full text-sm font-semibold rounded-lg px-3 py-2 bg-black border border-white/20 text-white focus:outline-none focus:border-white/50"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="quoted">Quoted</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
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